import Footer from "../../Component/Web/Footer";
import LatestProduct from "../../Component/Web/LatestProduct";
import Features from "../../Component/Web/Features";
import BestSeller from "../../Component/Web/BestSeller";
import Banner from "../../Component/Web/Banners/Banner";
import SubBanner from "../../Component/Web/Banners/SubBanner";


const HomePage = () => {
    return (
        <>
            <div className="space-y-8 bg-gray-50">
                {/* Banner with Boxes Blended */}
                <Banner showBoxes={true} img={"banner1.png"} to={"/sneakers"} />
                <BestSeller />
            </div>
            <div className="space-y-8 bg-gray-50">
                <Banner showBoxes={true} img={"banner1.png"} to={"/belt"} />
                <LatestProduct />
               <SubBanner
                img="banner1.png"
                to="/shop"
                title="Summer Sale"
                subtitle="Up to 50% off on all products!"
                ctaText="Explore Deals"
            />
                <Features />
            </div>
            <Footer />
        </>
    );
};

export default HomePage;
