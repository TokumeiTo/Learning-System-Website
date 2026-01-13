// Builder and Configuration
using LMS.Backend.Data.Dbcontext;
using LMS.Backend.Extenions;
using LMS.Backend.Helpers;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

/////////////////////Builder Created/////////////////////////////////

/* Controllers */
builder.Services.AddControllers();

// Swagger and Open Api
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

/* Application services (Helpers, Services, etc.) */
// Singleton
builder.Services.AddSingleton<PasswordHasher>();
builder.Services.AddSingleton<JwtHelper>();
// Helper Services
builder.Services.AddApplicationServices();
// EFCore Postgre SQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);


////////////////////Controller and Services added//////////////////////////////////

// Build Application
var app = builder.Build();

/////////////////////Built Application/////////////////////////////////

/* Middleware Pipeline */
var hasher = app.Services.GetRequiredService<PasswordHasher>();
Console.WriteLine(hasher.Hash("test123"));

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Security and HTTP
app.UseHttpsRedirection();

// Auth
app.UseAuthentication();
app.UseAuthorization();

// Map endpoints
app.MapControllers();

//////////////////Middleware done////////////////////////////////////

/* Run App */
app.Run();