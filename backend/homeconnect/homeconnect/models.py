from django.db import models

class Property(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()

    def __str__(self):
        return self.name

class Document(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='documents')
    title = models.CharField(max_length=100)
    file = models.FileField(upload_to='property_documents/')
    document_type = models.CharField(max_length=50, choices=[
        ('escritura', 'Escritura'),
        ('certificado', 'Certificado de Inspección'),
        ('otro', 'Otro'),
    ])
    upload_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.property.name}"