// PokemonCard.jsx

export default function PokemonCard({ pokemon }) {
  const types = pokemon.types.map((item) => item.type.name).join(', ');

  return (
    <div className="card">
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <p>No.{pokemon.id} {pokemon.name}</p>
      <p>{types}</p>
    </div>
  );
}