# Generated by Django 5.1.3 on 2024-11-28 08:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_conversacion_mensaje'),
    ]

    operations = [
        migrations.AddField(
            model_name='mensaje',
            name='visto',
            field=models.BooleanField(default=False),
        ),
    ]
