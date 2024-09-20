import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listingData }) {
  const [owner, setOwner] = useState(null);
  const [message, setMessage] = useState("");
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const res = await fetch(`/api/user/${listingData.userRef}`);
        const data = await res.json();

        setOwner(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOwner();
  }, [listingData.userRef]);
  return (
    <>
      {owner && (
        <div className="flex flex-col gap-4 mt-8">
          <p>
            Contact{" "}
            <span className="font-semibold">
              {owner.username.toUpperCase()}{" "}
            </span>
            for{" "}
            <span className="font-semibold">
              {listingData.name.toUpperCase()}
            </span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>

          <Link
            to={`mailto:${owner.email}?subject=Regarding ${listingData.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:bg-slate-800"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
