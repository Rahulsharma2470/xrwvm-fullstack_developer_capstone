import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  const params = useParams();
  const id = params.id;

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0, curr_url.indexOf("postreview"));

  const dealer_url = root_url + `djangoapp/dealer/${id}`;
  const review_url = root_url + `djangoapp/add_review`;
  const carmodels_url = root_url + `djangoapp/get_cars`;

  const postreview = async () => {

    let firstname = sessionStorage.getItem("firstname");
    let lastname = sessionStorage.getItem("lastname");
    let username = sessionStorage.getItem("username");

    let name = firstname + " " + lastname;

    if (!firstname || !lastname || name.includes("null")) {
      name = username;
    }

    if (!model || review === "" || date === "" || year === "") {
      alert("All details are mandatory");
      return;
    }

    let model_split = model.split(" ");

    let make_chosen = model_split[0];
    let model_chosen = model_split.slice(1).join(" ");

    let jsoninput = JSON.stringify({
      name: name,
      dealership: id,
      review: review,
      purchase: true,
      purchase_date: date,
      car_make: make_chosen,
      car_model: model_chosen,
      car_year: year
    });

    console.log("Sending review:", jsoninput);

    try {

      const res = await fetch(review_url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: jsoninput
      });

      const jsonResponse = await res.json();

      console.log("ADD REVIEW RESPONSE:", jsonResponse);
      console.log("HTTP STATUS:", res.status);

      if (jsonResponse.status === 200) {

        alert("Review posted successfully!");

        window.location.href =
          window.location.origin + "/dealer/" + id;

      } else if (jsonResponse.status === 403) {

        alert("You are not logged in. Please login again.");

      } else {

        alert(
          "Review failed: " +
          (jsonResponse.message || "Unknown error")
        );

      }

    } catch (error) {

      console.error("POST REVIEW ERROR:", error);
      alert("Error while posting review.");

    }
  };

  const get_dealer = async () => {

    try {

      const res = await fetch(dealer_url, {
        method: "GET",
        credentials: "include"
      });

      const retobj = await res.json();

      console.log("DEALER RESPONSE:", retobj);

      if (retobj.status === 200) {

        let dealerobjs = Array.from(retobj.dealer);

        if (dealerobjs.length > 0) {
          setDealer(dealerobjs[0]);
        }
      }

    } catch (error) {

      console.error("Dealer error:", error);

    }
  };

  const get_cars = async () => {

    try {

      const res = await fetch(carmodels_url, {
        method: "GET",
        credentials: "include"
      });

      const retobj = await res.json();

      console.log("CAR MODELS RESPONSE:", retobj);

      if (retobj.CarModels) {

        setCarmodels(retobj.CarModels);

      }

    } catch (error) {

      console.error("Car models error:", error);

    }
  };

  useEffect(() => {

    get_dealer();
    get_cars();

  }, []);

  return (
    <div>

      <Header />

      <div style={{ margin: "5%" }}>

        <h1 style={{ color: "darkblue" }}>
          {dealer.full_name}
        </h1>

        <div>

          <label>Review</label>

          <br />

          <textarea
            id="review"
            cols="50"
            rows="7"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />

        </div>

        <div className="input_field">

          Purchase Date

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

        </div>

        <div className="input_field">

          Car Make and Model

          <select
            name="cars"
            id="cars"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >

            <option value="" disabled>
              Choose Car Make and Model
            </option>

            {carmodels.map((carmodel, index) => (

              <option
                key={index}
                value={
                  carmodel.CarMake +
                  " " +
                  carmodel.CarModel
                }
              >

                {carmodel.CarMake} {carmodel.CarModel}

              </option>

            ))}

          </select>

        </div>

        <div className="input_field">

          Car Year

          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            max="2023"
            min="2015"
          />

        </div>

        <div>

          <button
            className="postreview"
            onClick={postreview}
          >
            Post Review
          </button>

        </div>

      </div>

    </div>
  );
};

export default PostReview;