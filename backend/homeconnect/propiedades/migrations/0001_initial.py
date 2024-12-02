# Generated by Django 5.1.3 on 2024-11-25 17:39

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Propiedad',
            fields=[
                ('propiedad_id', models.AutoField(primary_key=True, serialize=False)),
                ('titulo', models.CharField(max_length=255)),
                ('precio', models.DecimalField(decimal_places=2, max_digits=10)),
                ('foto_frontal', models.TextField(blank=True, null=True)),
                ('disponibilidad', models.CharField(blank=True, max_length=50, null=True)),
                ('direccion', models.CharField(blank=True, max_length=255, null=True)),
                ('tamano_m2', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('estado', models.CharField(blank=True, max_length=50, null=True)),
                ('fecha_adquisicion', models.DateField(blank=True, null=True)),
                ('fecha_venta', models.DateField(blank=True, null=True)),
                ('fecha_publicacion', models.DateField(blank=True, null=True)),
                ('eliminado', models.BooleanField(default=False)),
                ('recamaras', models.IntegerField(blank=True, null=True)),
                ('pisos', models.IntegerField(blank=True, null=True)),
                ('banos', models.IntegerField(blank=True, null=True)),
                ('material', models.CharField(blank=True, max_length=50, null=True)),
            ],
            options={
                'db_table': 'propiedades',
            },
        ),
    ]