using AppDeclaracion.Application.Declaraciones;
using Microsoft.Extensions.DependencyInjection;

namespace AppDeclaracion.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services) =>
        services.AddScoped<DeclaracionAnualService>();
}
