import React from 'react';
import { useParams } from 'react-router-dom';
import PropertyDetail from '../../components/PropertyDetail';

function PropertyView() {
  const { id } = useParams();

  return (
    <div>
      <PropertyDetail propertyId={parseInt(id)} onClose={() => window.history.back()} />
    </div>
  );
}

export default PropertyView;