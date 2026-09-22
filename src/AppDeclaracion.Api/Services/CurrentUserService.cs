using System.IdentityModel.Tokens.Jwt;
using AppDeclaracion.Application.Abstractions;

namespace AppDeclaracion.Api.Services;

public sealed class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    public Guid UsuarioId
    {
        get
        {
            var sub = httpContextAccessor.HttpContext?.User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                ?? throw new InvalidOperationException("No hay un usuario autenticado en el contexto actual.");
            return Guid.Parse(sub);
        }
    }
}
