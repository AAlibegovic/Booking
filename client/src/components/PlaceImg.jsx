import Image from "./Image.jsx";

export default function PlaceImg({ place, className = null }) {
  if (!place.photos?.length) {
    return null; 
  }
  if (!className) {
    className = 'object-cover';
  }

  return (
    <div className="flex gap-3 w-full">
  {place.photos.slice(0, 1).map((photo, index) => (
    <Image 
      key={index} 
      className={`${className} flex-1`} 
      src={photo} 
      alt="" 
    />
  ))}
</div>
  );
}
