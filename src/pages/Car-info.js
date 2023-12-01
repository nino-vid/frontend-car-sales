import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Data } from "../context/FetchedDataContext";
import NavigationBar from "../components/NavigationBar/navigation-bar";
import Footer from "./../components/footer/footer";
import Header from "./../components/header/Header";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { BsZoomIn, BsFillCalculatorFill } from "react-icons/bs";
import { AiOutlineFilePdf } from "react-icons/ai";
import bankIcon from "../assets/images/output-onlinepngtools.png";
import pdf from "../assets/pdf/kupoprodajni-ugovor.pdf";

import "./Car-info.css";

const Thumbnail = ({ arr, image, index }) => {
  return (
    <div className="thumbnail">
      {arr.map((imgsrc, i) => (
        <img
          key={i}
          height="80"
          src={imgsrc}
          onClick={() => image(i)}
          className={index === i ? "active" : "inactive"}
          alt="car"
        />
      ))}
    </div>
  );
};

const Slideshow = ({ imgs, carData, toggleModal, closeModal }) => {
  const [index, setIndex] = useState(0);
  const [isHoveredImage, setIsHoveredImage] = useState(false);

  useEffect(() => {
    setIndex(0);
  }, []);

  const next = () => {
    if (index === imgs.length - 1) {
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index === 0) {
      setIndex(imgs.length - 1);
    } else {
      setIndex(index - 1);
    }
  };

  // RENDER ONLY imgs[3] BECAUSE OF THE PHOTO RESOLUTION, INSTEAD OF imgs[index]
  return (
    <div className="slideshow">
      <div className="car-info-title">
        <h1>{carData.title}</h1>
        <h2>{carData.year}. godište</h2>
      </div>
      <div
        className="mainImg-container"
        onMouseEnter={() => setIsHoveredImage(true)}
        onMouseLeave={() => setIsHoveredImage(false)}
      >
        <img
          className="mainImg"
          src={imgs[3]}
          alt="car"
          onClick={toggleModal}
        />
        {isHoveredImage && (
          <BsZoomIn
            size={42}
            color="white"
            className="hovered-icon"
            onClick={(e) => {
              e.stopPropagation(); // This prevents the event from reaching the parent
              toggleModal();
            }}
          />
        )}
      </div>
      <div className="actions">
        <button className="prev" onClick={prev}>
          <IoIosArrowBack
            size={56}
            color="white"
            style={{
              filter: "drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.3))",
            }}
          />
        </button>
        <button className="next" onClick={next}>
          <IoIosArrowForward
            size={56}
            color="white"
            style={{
              filter: "drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.3))",
            }}
          />
        </button>
      </div>
      <Thumbnail arr={imgs} image={setIndex} index={index} />
    </div>
  );
};

const BasicInformation = ({ carData }) => {
  return (
    <div className="car-info-basic-informations">
      <h2>Opšte informacije</h2>
      <div className="basic-information">
        <ul>
          <li>
            Stanje
            <span>{carData.new === false ? "Polovno vozilo" : "Novo"}</span>
          </li>
          <li>
            Marka<span>{carData.brandName}</span>
          </li>
          <li>
            Model<span>{carData.modelName}</span>
          </li>
          <li>
            Godište<span>{carData.year}.</span>
          </li>
          <li>
            Kilometraža<span>{carData.mileage} km</span>
          </li>
          <li>
            Karoserija<span>{carData.chassis}</span>
          </li>
          <li>
            Gorivo<span>{carData.fuelType}</span>
          </li>
        </ul>
        <ul>
          <li>
            Kubikaža<span>{carData.brandName}</span>
          </li>
          <li>
            Snaga motora
            <span>
              {carData.power}/{Math.floor(carData.power * 1.341)} kW/KS
            </span>
          </li>
          <li>
            Fiksna cena<span>{carData.fixed === false ? "NE" : "DA"}</span>
          </li>
          <li>
            Zamena<span>{carData.zamena === false ? "NE" : "DA"}</span>
          </li>
          <li>
            Broj oglasa<span>{carData.AdID}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const Modal = ({ imgSrc, onClose }) => {
  const handleModalClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  const handleImageClick = (e) => {
    e.stopPropagation(); // Prevent event from reaching modal container
  };

  return (
    <div className="modal-container" onClick={handleModalClick}>
      <img src={imgSrc} alt="Enlarged view" onClick={handleImageClick} />
      <span className="close-modal" onClick={onClose}>
        X
      </span>
    </div>
  );
};

const CarInfo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();
  // console.log(id);
  const { infoData } = useContext(Data);

  if (!infoData || infoData.length === 0) {
    return <div className="loader"></div>;
  }

  const carDataIndex = infoData.findIndex((car) => car.AdID === Number(id));
  const carData = infoData[carDataIndex];

  if (!carData) {
    return <p>Car not found!</p>;
  }

  let commaIndex = carData.tag_block.indexOf(",");
  let slicedPrice = carData.tag_block.slice(0, commaIndex).trim();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const CashLoanAd = () => {
    const [priceValueRange, setPriceValueRange] = useState(300000);
    const [monthValueRange, setMonthValueRange] = useState(71);

    const handlePriceChange = (event) => {
      setPriceValueRange(Number(event.target.value));
    };

    const handleMonthChange = (event) => {
      setMonthValueRange(Number(event.target.value));
    };

    const creditMonthlyPayment =
      Math.round(((priceValueRange * 1.54) / monthValueRange) * 100) / 100;
    const formattedCreditMonthlyPayment = creditMonthlyPayment.toLocaleString(
      "de-DE",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

    return (
      <div className="cash-loan-ad-main">
        <div className="container">
          <div className="first-row">
            <p>
              <span>
                <BsFillCalculatorFill size={32} color="green" />
              </span>
              Ponuda keš kredita
            </p>
          </div>
          <div className="second-row">
            <img src={bankIcon} alt="Description" className="custom-image" />
            <div className="monthly-payment">
              <p>{formattedCreditMonthlyPayment} RSD</p>
              <span>mesečna rata</span>
            </div>
            <div>
              <p>0% naknade za puštanje kredita</p>
            </div>
          </div>

          <div className="third-row">
            <div className="slider-container">
              <span>Iznos kredita</span>
              <div style={{ display: "flex" }}>
                <input
                  id="priceRange"
                  type="range"
                  min="50000"
                  max="2400000"
                  step="50000"
                  value={priceValueRange}
                  onChange={handlePriceChange}
                />
                <label htmlFor="priceRange">
                  {priceValueRange.toLocaleString()} RSD
                </label>
              </div>
            </div>
            <div className="slider-container">
              <span>Period otplate</span>
              <div style={{ display: "flex" }}>
                <input
                  id="monthRange"
                  type="range"
                  min="13"
                  max="71"
                  step="1"
                  value={monthValueRange}
                  onChange={handleMonthChange}
                />
                <label htmlFor="monthRange">
                  {monthValueRange.toLocaleString()} Meseci
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <NavigationBar />
      {isModalOpen && (
        <Modal imgSrc={carData.photoLink[3]} onClose={toggleModal} />
      )}
      <div className="car-details-container">
        <div className="car-details-left-container">
          <Slideshow
            carData={carData}
            imgs={carData.photoLink}
            toggleModal={toggleModal}
          />
          <BasicInformation carData={carData} />
          <CashLoanAd />
        </div>
        <div className="car-details-right-container">
          <div>
            <h1>{slicedPrice}</h1>
          </div>
          <a href={pdf} target="_blank" rel="noreferrer" alt="pdf">
            <div class="pdf-div">
              <AiOutlineFilePdf size={36} color="red" />
              <p>
                KUPOPRODAJNI UGOVOR <br />
                <span>PREUZMITE KUPOPRODAJNI UGOVOR</span>
              </p>
            </div>
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CarInfo;
