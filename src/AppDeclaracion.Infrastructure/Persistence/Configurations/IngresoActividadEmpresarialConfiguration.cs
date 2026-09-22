using AppDeclaracion.Domain.ActividadEmpresarial;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AppDeclaracion.Infrastructure.Persistence.Configurations;

public class IngresoActividadEmpresarialConfiguration : IEntityTypeConfiguration<IngresoActividadEmpresarial>
{
    public void Configure(EntityTypeBuilder<IngresoActividadEmpresarial> builder)
    {
        builder.ToTable("ingresos_actividad_empresarial");
        builder.HasKey(i => i.Id);

        builder.HasMany(i => i.Deducciones)
            .WithOne()
            .HasForeignKey(d => d.IngresoActividadEmpresarialId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.Navigation(i => i.Deducciones).UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}

public class DeduccionActividadConfiguration : IEntityTypeConfiguration<DeduccionActividad>
{
    public void Configure(EntityTypeBuilder<DeduccionActividad> builder)
    {
        builder.ToTable("deducciones_actividad_empresarial");
        builder.HasKey(d => d.Id);
        builder.Property(d => d.Concepto).IsRequired().HasMaxLength(200);
    }
}
