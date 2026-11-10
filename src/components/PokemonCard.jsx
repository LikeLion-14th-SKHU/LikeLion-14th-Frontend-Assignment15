const TYPE_STYLES = {
    normal: 'bg-gray-100 text-gray-600',
    fire: 'bg-orange-100 text-orange-700',
    water: 'bg-blue-100 text-blue-700',
    electric: 'bg-yellow-100 text-yellow-700',
    grass: 'bg-green-100 text-green-700',
    ice: 'bg-cyan-100 text-cyan-700',
    fighting: 'bg-red-100 text-red-700',
    poison: 'bg-purple-100 text-purple-700',
    ground: 'bg-amber-100 text-amber-700',
    flying: 'bg-indigo-100 text-indigo-700',
    psychic: 'bg-pink-100 text-pink-700',
    bug: 'bg-lime-100 text-lime-700',
    rock: 'bg-stone-100 text-stone-700',
    ghost: 'bg-violet-100 text-violet-700',
    dragon: 'bg-indigo-100 text-indigo-800',
    dark: 'bg-slate-200 text-slate-800',
    steel: 'bg-zinc-100 text-zinc-700',
    fairy: 'bg-rose-100 text-rose-700',
  };
  
  export default function PokemonCard({
    pokemon,
    featured = false,
  }) {
    const image =
      pokemon.sprites?.other?.['official-artwork']?.front_default ||
      pokemon.sprites?.front_default;
  
    const number = String(pokemon.id).padStart(3, '0');
  
    return (
      <article
        className={`
          group flex flex-col items-center rounded-2xl
          border border-slate-200 bg-white text-center
          shadow-sm transition-all duration-200
          hover:-translate-y-1 hover:shadow-lg
          ${featured ? 'w-full max-w-64 p-6' : 'p-4'}
        `}
      >
        <span className="self-end text-xs font-semibold text-slate-400">
          #{number}
        </span>
  
        <div
          className={`
            flex items-center justify-center rounded-full bg-slate-50
            ${featured ? 'h-36 w-36' : 'h-28 w-28'}
          `}
        >
          <img
            src={image}
            alt={pokemon.name}
            loading="lazy"
            className="h-[85%] w-[85%] object-contain transition-transform duration-200 group-hover:scale-110"
          />
        </div>
  
        <h3 className="mt-3 text-base font-bold capitalize text-slate-800">
          {pokemon.name}
        </h3>
      </article>
    );
  }
  