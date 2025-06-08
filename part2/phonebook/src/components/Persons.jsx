const Persons = ({ persons, filter, onDelete }) => {
  const filtered = persons.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <>
      {filtered.map(p => (
        <p key={p.id}>
          {p.name} {p.number}
          <button onClick={() => onDelete(p.id)}>delete</button>
        </p>
      ))}
    </>
  )
}

export default Persons