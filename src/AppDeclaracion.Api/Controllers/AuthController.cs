using AppDeclaracion.Api.Auth;
using AppDeclaracion.Application.Abstractions;
using AppDeclaracion.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AppDeclaracion.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(UserManager<ApplicationUser> userManager, IJwtTokenService jwtTokenService) : ControllerBase
{
    [HttpPost("registro")]
    public async Task<ActionResult<AuthResponse>> Registro(RegistroRequest request)
    {
        var usuario = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            UserName = request.Email,
            Email = request.Email,
            Nombre = request.Nombre,
            Rfc = request.Rfc,
        };

        var resultado = await userManager.CreateAsync(usuario, request.Password);
        if (!resultado.Succeeded)
        {
            foreach (var error in resultado.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem(ModelState);
        }

        var token = jwtTokenService.GenerarToken(usuario.Id, usuario.Email!);
        return Ok(new AuthResponse(token));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var usuario = await userManager.FindByEmailAsync(request.Email);
        if (usuario is null || !await userManager.CheckPasswordAsync(usuario, request.Password))
        {
            return Unauthorized();
        }

        var token = jwtTokenService.GenerarToken(usuario.Id, usuario.Email!);
        return Ok(new AuthResponse(token));
    }
}
