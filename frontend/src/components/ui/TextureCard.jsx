import React from 'react'
import texture from "../../assets/images/texture1.png";



const TextureCard = ({ image = texture, name = "Texture Name", description = "Texture description here." }) => {
  return (
    <div
      className="relative flex group hover:cursor-pointer transform transition-transform duration-300 hover:scale-102 shadow-2xl rounded-2xl sm:rounded-4xl aspect-[4/3] w-full h-full overflow-hidden bg-black"
    >
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover block "
      />
      <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white p-3 rounded-lg text-lg font-semibold tracking-wider text-center z-10 opacity-100 transition-opacity duration-300">
        {name}
        <div className="text-xs mt-1 opacity-80">{description}</div>
      </div>
    </div>
  );
}

export default TextureCard
