using AppDeclaracion.Domain.ActividadEmpresarial;
using AppDeclaracion.Domain.Arrendamiento;
using AppDeclaracion.Domain.Declaraciones;
using AppDeclaracion.Domain.Resico;
using AppDeclaracion.Domain.SueldosYSalarios;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AppDeclaracion.Infrastructure.Persistence.Configurations;

public class DeclaracionAnualConfiguration : IEntityTypeConfiguration<DeclaracionAnual>
{
    public void Configure(EntityTypeBuilder<DeclaracionAnual> builder)
    {
        builder.ToTable("declaraciones_anuales");

        builder.HasKey(d => d.Id);
        builder.Property(d => d.Id).ValueGeneratedNever();

        builder.HasIndex(d => new { d.UsuarioId, d.Ejercicio }).IsUnique();

        builder.HasMany(d => d.DeduccionesPersonales)
            .WithOne()
            .HasForeignKey(dp => dp.DeclaracionAnualId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.Navigation(d => d.DeduccionesPersonales).UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.HasOne(d => d.IngresoResico)
            .WithOne()
            .HasForeignKey<IngresoResico>(i => i.DeclaracionAnualId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(d => d.IngresoSueldos)
            .WithOne()
            .HasForeignKey<IngresoSueldos>(i => i.DeclaracionAnualId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(d => d.IngresoActividadEmpresarial)
            .WithOne()
            .HasForeignKey<IngresoActividadEmpresarial>(i => i.DeclaracionAnualId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(d => d.IngresoArrendamiento)
            .WithOne()
            .HasForeignKey<IngresoArrendamiento>(i => i.DeclaracionAnualId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(d => d.Resultado)
            .WithOne()
            .HasForeignKey<ResultadoCalculo>(r => r.DeclaracionAnualId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
