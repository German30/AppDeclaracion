using Microsoft.AspNetCore.Identity;

namespace AppDeclaracion.Infrastructure.Identity;

public class ApplicationUser : IdentityUser<Guid>
{
    public string Nombre { get; set; } = string.Empty;

    public string? Rfc { get; set; }
}
