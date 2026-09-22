using AppDeclaracion.Domain.Declaraciones;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AppDeclaracion.Infrastructure.Persistence.Configurations;

public class ResultadoCalculoConfiguration : IEntityTypeConfiguration<ResultadoCalculo>
{
    public void Configure(EntityTypeBuilder<ResultadoCalculo> builder)
    {
        builder.ToTable("resultados_calculo");
        builder.HasKey(r => r.Id);
    }
}
