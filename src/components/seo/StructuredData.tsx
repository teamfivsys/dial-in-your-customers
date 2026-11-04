import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  data: object | object[];
}

const StructuredData = ({ data }: StructuredDataProps) => {
  const schemas = Array.isArray(data) ? data : [data];
  
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": schemas
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData).replace(/</g, "\\u003c")}
      </script>
    </Helmet>
  );
};

export default StructuredData;
