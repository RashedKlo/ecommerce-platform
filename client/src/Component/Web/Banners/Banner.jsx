import { Link } from "react-router-dom";
import BlendedBox from "../BlendedBox";
function Banner({ showBoxes, img, to }) {
    return (
        <Link
            to={to}
            className={`relative bg-transparent ${showBoxes ? `mb-64` : 'mb-0'}`}>
          <img
    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1300&h=400&fit=crop"
    alt="Banner"
    className="object-cover w-[600px] md:w-[1300px] h-[200px] md:h-[400px]"
/>

            {/* Blended Modern Boxes */}
            <div className={` absolute   -bottom-20 left-0 right-0 px-8 md:px-12  ${showBoxes ? 'flex' : 'hidden'} flex-row  items-center justify-center mb-6  gap-4`}>
                <BlendedBox title="Leather Bag" src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop" price="100" off="20" />
<BlendedBox title="Nike Sneakers" src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop" price="100" off="10" />
<BlendedBox title="Running Shoes" src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop" price="100" off="10" />


            </div>
        </Link>
    );
}

export default Banner;
