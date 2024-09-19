import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

function ListingPage() {
  SwiperCore.use([Navigation]);

  const [listingData, setListingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const params = useParams();
  const listingID = params.listingID;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/listing/get/${listingID}`);
        const data = await response.json();

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        setLoading(false);
        setListingData(data);
        console.log(listingData);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingID]);

  return (
    <main className="min-h-screen">
      {loading && (
        <p className="text-center my-9 font-bold text-3xl">Loading...</p>
      )}
      {error && (
        <div className="flex flex-col gap-8 justify-center items-center my-10">
          <p className="text-center  font-bold text-3xl">
            Something went wrong !!
          </p>
          <Link to="/">
            {" "}
            <button className="text-white bg-slate-700 hover:bg-slate-800 p-3 rounded-lg">
              Back to Home
            </button>
          </Link>
        </div>
      )}

      {listingData && !error && !loading && (
        <>
          <Swiper navigation>
            {listingData.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[500px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </main>
  );
}

export default ListingPage;
