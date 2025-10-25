import { useParams } from 'react-router';

export default function Page() {
  const { id } = useParams();

  return <div>Scenario Detail Page: {id}</div>;
}
