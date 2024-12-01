from django.shortcuts import render

# Create your views here.
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Property, Document
from .forms import DocumentForm

def property_documents(request, property_id):
    property = get_object_or_404(Property, id=property_id)
    documents = property.documents.all()

    if request.method == 'POST':
        form = DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            document = form.save(commit=False)
            document.property = property
            document.save()
            messages.success(request, 'Documento cargado exitosamente.')
            return redirect('property_documents', property_id=property_id)
    else:
        form = DocumentForm()

    return render(request, 'property_documents.html', {
        'property': property,
        'documents': documents,
        'form': form,
    })

def delete_document(request, document_id):
    document = get_object_or_404(Document, id=document_id)
    property_id = document.property.id
    document.delete()
    messages.success(request, 'Documento eliminado exitosamente.')
    return redirect('property_documents', property_id=property_id)