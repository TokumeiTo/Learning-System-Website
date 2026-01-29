// Builder and Configuration
using System.Text;
using FluentValidation;
using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Data.Entities;
using LMS.Backend.Data.Interceptors;
using LMS.Backend.Extensions;
using LMS.Backend.Helpers;
using LMS.Backend.Middlewares;
using LMS.Backend.Validators;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

/////////////////////Builder Created/////////////////////////////////

/* Controllers */
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // FIXES THE "0" ISSUE:
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());

        // PREVENTS INFINITE LOOP CRASH:
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<LoginRequestValidator>();

// Swagger and Open Api
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

/* Application services (Helpers, Services, etc.) */
// EFCore Postgre SQL
builder.Services.AddDbContext<AppDbContext>((sp, options) =>
{
    var auditInterceptor = sp.GetRequiredService<AuditInterceptor>();
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
            .AddInterceptors(auditInterceptor);
});

// Hash Password
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

// Singletons
builder.Services.AddSingleton<JwtHelper>();
builder.Services.AddSingleton<AuditInterceptor>();
// Helper Services
builder.Services.AddApplicationServices();
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);
// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
    policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
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
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "default_secret_key_32_characters_long"))
    };
});

////////////////////Controller and Services added//////////////////////////////////

// Build Application
var app = builder.Build();

/////////////////////Built Application/////////////////////////////////

/* Middleware Pipeline */

// Exception Middleware
app.UseMiddleware<ExceptionMiddleware>();

app.UseRouting();

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Security and HTTP
// app.UseHttpsRedirection();
app.UseCors("AllowReactApp");

// Auth
app.UseAuthentication();
app.UseAuthorization();

// Map endpoints
app.MapControllers();

//////////////////Middleware done////////////////////////////////////

/* Run App */
app.Run();