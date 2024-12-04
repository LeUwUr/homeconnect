# Generated by Django 5.1.3 on 2024-12-03 00:29

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_usuario_username'),
        ('moduloac', '0003_rename_tamano_m2_propiedad_tamano_m2_const_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='oferta',
            name='fecha_expiracion',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.CreateModel(
            name='Notificacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipo', models.CharField(choices=[('Cambio de precio', 'Cambio de precio'), ('Cambio de oferta', 'Cambio de oferta'), ('Vencimiento de oferta', 'Vencimiento de oferta'), ('Cambio de disponibilidad', 'Cambio de disponibilidad'), ('Guardado en favoritos', 'Guardado en favoritos')], max_length=50)),
                ('mensaje', models.TextField()),
                ('leida', models.BooleanField(default=False)),
                ('fecha', models.DateTimeField(auto_now_add=True)),
                ('propiedad', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='moduloac.propiedad')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'notificaciones',
            },
        ),
        migrations.CreateModel(
            name='Favorito',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_agregado', models.DateTimeField(auto_now_add=True)),
                ('propiedad', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='moduloac.propiedad')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'favoritos',
                'unique_together': {('usuario', 'propiedad')},
            },
        ),
    ]