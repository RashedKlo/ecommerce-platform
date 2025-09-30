using System.Linq.Expressions;
using System.Security.AccessControl;
using System.Reflection.Metadata;
using System.Xml.Schema;
using System.Net.Security;
using System.Net.Mime;
using System;
using System.Collections.Immutable;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Api.models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Server.HttpSys;
using Stripe;

var builder = WebApplication.CreateBuilder(args);



builder.Services.AddCors(options =>
   {
       options.AddPolicy("AllowAllOrigins",
           builder =>
           {
               builder.AllowAnyOrigin()
                      .AllowAnyMethod()
                      .AllowAnyHeader();
           });
   });

builder.Services.AddEndpointsApiExplorer();


builder.Services.AddSwaggerGen(opt =>
{
    opt.SwaggerDoc("v1", new OpenApiInfo { Title = "MyAPI", Version = "v1" });
    opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });

    opt.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});





var jwtOptions = builder.Configuration.GetSection("Jwt").Get<JwtOptions>();
builder.Services.AddSingleton(jwtOptions!);

builder.Services.AddAuthentication().AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
{
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidIssuer = jwtOptions!.Issuer,
        ValidateAudience = false,
        ValidAudience = jwtOptions.Audience,
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey)),
        ClockSkew = TimeSpan.Zero
    };

});



builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie()
.AddGoogle(options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"]!;
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"]!;
    options.SaveTokens = true;
});




builder.Services.AddControllers();


builder.Services.AddAuthorizationBuilder()
.AddPolicy("Users", builder =>
{
    builder.RequireRole("User", "Admin");
})
.AddPolicy("Admins", builder =>
{
    builder.RequireRole("Admin");
})
.AddPolicy("Writers", builder =>
{
    builder.RequireRole("Writer", "Admin");
})
.AddPolicy("Product Managers", builder =>
{
    builder.RequireRole("Product Manager", "Admin");
})
    .AddPolicy("EmployeesOnly", builder =>
    {
        builder.RequireRole("Admin");
        builder.RequireClaim("UserType", "Employee");
    })
    .AddPolicy("AgeGreaterThan25", builder =>
    {
        builder.RequireAssertion(context =>
        {
            DateTime dto = DateTime.Now;
            DateTime.TryParse(context.User.FindFirstValue("DateOfBirth"), out dto);
            return DateTime.Today.Year - dto.Year > 25;
        });
    });



builder.Services.AddControllers();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwaggerUI();
    app.UseSwagger();

}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("AllowAllOrigins");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
