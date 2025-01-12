# Generated by Django 5.0.6 on 2024-12-29 19:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='kind_of_person',
            field=models.CharField(choices=[('user', 'User'), ('operator', 'Operator'), ('admin', 'Admin')], default='user', max_length=255),
        ),
    ]