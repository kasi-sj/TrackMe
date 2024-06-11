import React from 'react'

const page = ({ params }: { params: { url: string } }) => {
  
  return <div>{params.url}</div>;
};

export default page