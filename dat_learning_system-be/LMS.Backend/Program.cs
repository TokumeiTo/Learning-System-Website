using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Data.Interceptors;
using LMS.Backend.Extensions;
using LMS.Backend.Helpers;
using LMS.Backend.Hubs;
using LMS.Backend.Middlewares;
using LMS.Backend.Services.Background;
using LMS.Backend.Validators;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

/////////////////////Builder Created/////////////////////////////////

builder.Services.AddHttpClient();
/* Controllers & Validators */
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // FIXES THE "0" ISSUE:
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());

        // PREVENTS INFINITE LOOP CRASH:
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<LoginRequestValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<SubmitEnrollmentValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<GrammarValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<EBookRequestValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<SubmitEnrollmentValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<TestValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<SchedulePlanValidator>();

builder.Services.AddSignalR();

/* Swagger */
#region Swagger section
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "LMS API", Version = "v1" });

    // 1. Define the Security Scheme
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below."
    });

    // 2. Make Swagger use that scheme
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference // Fixed name here
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});
#endregion

/* Application services (Helpers, Services, etc.) */
#region EFCore Activation & Password Definition
// EFCore Postgre SQL and Interceptors Activation
builder.Services.AddDbContext<AppDbContext>((sp, options) =>
{
    var auditInterceptor = sp.GetRequiredService<AuditInterceptor>();
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"),
        npgsqlOptions =>
        {
            // This handles the "transient failure" by retrying the connection
            npgsqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorCodesToAdd: null);
        })
    .AddInterceptors(auditInterceptor);
});

// Hash Password Helper
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = false; // Set to true for production
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;

    // Since we login with CompanyCode, we ensure the UserName is the unique key
    options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();
#endregion

#region Helper Registration/Dependency Injections
// Singletons
builder.Services.AddSingleton<JwtHelper>();

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<AuditInterceptor>();

// Helper Services
builder.Services.AddApplicationServices();
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);
builder.Services.AddHostedService<NotificationCleanupWorker>();
builder.Services.AddHostedService<AnnouncementCleanupWorker>();
builder.Services.AddHostedService<ScheduleCleanupWorker>();

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 420_000_000; // 400 MB
});
builder.Services.Configure<KestrelServerOptions>(options =>
{
    options.Limits.MaxRequestBodySize = 420_000_000; // 400 MB
});
#endregion

#region SECURITY & CORS
// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
    policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
// Auth/JWT Bearer
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwtKey = builder.Configuration["Jwt:Key"]
                 ?? throw new InvalidOperationException("JWT Key is missing from configuration! Please check appsettings.Development.json.");

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey))
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/notificationHub"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});
#endregion
////////////////////Controller and Services added//////////////////////////////////

// Build Application
var app = builder.Build();

/////////////////////Built Application/////////////////////////////////

/* Middleware Pipeline */

// Exception Middleware
app.UseMiddleware<ExceptionMiddleware>();

// 1. Move CORS to the TOP (Before Static Files and Routing)
app.UseCors("AllowReactApp");

// 2. Tell Static Files to use the CORS policy
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        // This adds the "Access-Control-Allow-Origin" header to static files
        ctx.Context.Response.Headers.Append("Access-Control-Allow-Origin", "http://localhost:5173");
        ctx.Context.Response.Headers.Append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        ctx.Context.Response.Headers.Append("Access-Control-Allow-Credentials", "true");
        ctx.Context.Response.Headers.Append("Accept-Ranges", "bytes");
    }
});

app.UseRouting();

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Auth
app.UseAuthentication();
app.UseAuthorization();

// Signal R
app.MapHub<NotificationHub>("/notificationHub");

// Map endpoints
app.MapControllers();

//////////////////Middleware done////////////////////////////////////

/* Run App */
app.Run();