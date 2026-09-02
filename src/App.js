import { useState, useEffect } from "react";
import "./App.css";
//import { ReactComponent as StartIcon } from "./images/logo.svg";

const info = [
  {
    id: 1,
    title: "Brand Recognition",
    body: "Boost your brand recognition with each click. Generic links don’t mean a thing. Branded links help instil confidence in your content.",
    icon: process.env.PUBLIC_URL + "/images/icon-brand-recognition.svg",
  },
  {
    id: 2,
    title: "Detailed Records",
    body: "Gain insights into who is clicking your links. Knowing when and where people engage with your content helps inform better decisions.",
    icon: process.env.PUBLIC_URL + "/images/icon-detailed-records.svg",
  },

  {
    id: 3,
    title: "Fully Customizable",
    body: "  Improve brand awareness and content discoverability through customizable links, supercharging audience engagement.",
    icon: process.env.PUBLIC_URL + "/images/icon-fully-customizable.svg",
  },
];

const saved_shorted_links = [
  {
    id: 1,
    o_link: "https://www.facebook.com",
    s_link: "hhtps://rel.link/fa",
  },

  {
    id: 2,
    o_link: "https://www.instagram.com",
    s_link: "hhtps://rel.link/ig",
  },
]; //used to save and hold new inserted shorted links

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <div className="mainContainer">
        <Search />
        <InfoSection />
        <LastCallSection>
          <h2>Boost your links today</h2>
          <Button radius={50} padding={30}>
            Get Started
          </Button>
        </LastCallSection>
      </div>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header>
      <div className="header">
        <Logo bg={"header"} className="logo" />
        <ul className="main_links">
          <li>Features</li>
          <li>Pricing</li>
          <li>Resources</li>
        </ul>
        <ul className="loginSignUp_links">
          <li>Login</li>
          <li>
            <button className="header_btn">Sign Up</button>
          </li>
        </ul>
        <button className="hamburguerMenu_btn">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </header>
  );
}

function Logo({ bg }) {
  return (
    <img
      alt="company logo"
      src={`${process.env.PUBLIC_URL}/images/logo.svg`}
      className={bg === "header" ? "" : "svg_footer"}
    />
  );
}

function Hero() {
  return (
    <div className="HeroSection">
      <div className="HeroTextdiv">
        <div>
          <h1>More than just shorter links</h1>
          <h3>
            Build your brand’s recognition and get detailed
            <br /> insights on how your links are performing.
          </h3>
          <Button radius={50} padding={30}>
            Get Started
          </Button>
        </div>
      </div>
      <div className="HeroImgContainer">
        <img
          alt="hero background img"
          src={process.env.PUBLIC_URL + "/images/illustration-working.svg"}
        />
      </div>
    </div>
  );
}

function Search() {
  const [searchInput, setSearchInput] = useState("");
  const [shortedClicked, setShortedClicked] = useState(false);
  const [shortedData, setShortedData] = useState(() => {
    try {
      const saved = localStorage.getItem("saved_links");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Error reading localStorage:", err);
      return [];
    }
  });

  /*console.log("teste:");
  console.log(shortedData);
  console.log(shortedData.length);
  */

  function getInputData(e) {
    //console.log(e.target.value); //done
    //set the searchInput value
    setSearchInput(e.target.value);
    console.log(searchInput);
  }

  useEffect(
    function () {
      localStorage.setItem("saved_links", JSON.stringify(shortedData));
    },
    [shortedData],
  );

  async function handleAddLink() {
    // se tiver vazio o input (confirmar com algum hook que ja existe) deixar a mensagem
    setShortedClicked(true);

    if (searchInput === "") return;

    try {
      const shortenedUrl = await getShortedLink();
      if (!shortenedUrl) return;

      const newLink = {
        id:
          shortedData.length > 0
            ? shortedData[shortedData.length - 1].id + 1
            : 1,
        o_link: searchInput,
        s_link: shortenedUrl,
      };

      setShortedData((shortedData) => [...shortedData, newLink]);
    } catch (err) {
      console.error(err.message);
    }

    setShortedClicked(false);
  }

  async function getShortedLink() {
    if (!searchInput || !searchInput.trim()) return null;

    // Format URL if missing protocol
    let formattedUrl = searchInput.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    //this doesnt work on github pages as cors requires API key and github also block these api calls
    /*const targetApi = encodeURIComponent("https://cleanuri.com/api/v1/shorten");
    const res = await fetch(`https://corsproxy.io/?${targetApi}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        url: formattedUrl,
      }),
    });
*/

    //using TinyURL
    const res = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(formattedUrl)}`,
    );
    //const resData = await res.json();
    if (!res.ok) {
      // alert(resData.error);
      alert("Error shortening the link");
      throw new Error("Failed to shorten the link");
    }

    //return resData.result_url;
    const shortenedUrl = await res.text();
    return shortenedUrl;
  }

  return (
    <div className="searchSectionContainer">
      <div className="searchAreaContainer">
        <div className="SearchArea ">
          <input
            type="text"
            placeholder="Shorten a link here..."
            className={
              searchInput === "" && shortedClicked ? "noInputValue" : ""
            }
            onChange={(e) => getInputData(e)}
          />
          <Button radius={6} padding={30} onclick={handleAddLink}>
            Shorten It!
          </Button>
        </div>
        <p>{searchInput === "" && shortedClicked ? "Please add a link" : ""}</p>
      </div>

      {shortedData.length > 0 ? <ShowLinks data={shortedData} /> : ""}
    </div>
  );
}
function ShowLinks({ data }) {
  console.log({ data });
  return (
    <div className="blocks shorted_link_container">
      {data?.map((e) => (
        <Links data={e} key={e.id} />
      ))}
    </div>
  );
}

function Links({ data }) {
  const [btnClicked, setBtnClicked] = useState(0);

  async function handleCopy() {
    setBtnClicked(!btnClicked);
    try {
      await navigator.clipboard.writeText(data.s_link);
      setBtnClicked(true);

      // Reset button state back to original after 2 seconds
      // setTimeout(() => setBtnClicked(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  /* useEffect(
    function () {
       setBtnClicked(true);
      navigator.clipboard.writeText(data.s_link);
    },
    [btnClicked, data.s_link],
  );
*/
  return (
    <div className="link_block">
      <span>{data.o_link}</span>
      <div className="sLinkBtn_block">
        <span>{data.s_link}</span>
        <Button
          radius={5}
          padding={"40"}
          onclick={handleCopy}
          isCliked={btnClicked}
        >
          {btnClicked ? "Copied!" : "Copy"}
        </Button>
      </div>
    </div>
  );
}

function InfoSection() {
  return (
    <section className="InfoSection blocks">
      <h2>Advanced Statistics</h2>
      <p>
        Track how your links are performing across the web with our advanced
        statistics dashboard.
      </p>
      <InfoCardSection />
    </section>
  );
}

/*
EXTRAS
**/

function Button({ children, radius, padding, onclick, isCliked = false }) {
  return (
    <button
      className={isCliked ? "gnr_btn btn_copied" : "gnr_btn"} //"gnr_btn"
      style={{ borderRadius: radius + "px", padding: "15px " + padding + "px" }}
      onClick={onclick}
    >
      {children}
    </button>
  );
}

function InfoCardSection() {
  return (
    <section className="CardSection">
      <div className="CardsContainer">
        {info.map((e) => (
          <Card icon={e.icon} title={e.title} body={e.body} key={e.id} />
        ))}
      </div>
    </section>
  );
}

function Card({ icon, title, body }) {
  return (
    <div className="Card">
      <img className="cardIcon" src={icon} alt="icon element" />
      {console.log(icon)}
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

function LastCallSection({ children }) {
  return <div className="lastCallSection">{children}</div>;
}

function Footer() {
  return (
    <footer className="attribution">
      <div className="footer_container">
        <Logo bg={"svg_footer"} />
        <div className="footerLinks">
          <ul>
            <li>Features</li>
            <li>Link Shortening</li>
            <li>Branded Links</li>
            <li>Analytics</li>
          </ul>
          <ul>
            <li>Resources</li>
            <li>Blog</li>
            <li>Developers</li>
            <li>Support</li>
          </ul>
          <ul>
            <li>Company</li>
            <li>About</li>
            <li> Our Team</li>
            <li> Careers</li>
            <li> Contact</li>
          </ul>
        </div>
        <ul className="socials">
          <li>
            <img
              alt="facebook logo"
              src={`${process.env.PUBLIC_URL}/images/icon-facebook.svg`}
            />
          </li>
          <li>
            <img
              alt="twitter logo"
              src={`${process.env.PUBLIC_URL}/images/icon-twitter.svg`}
            />
          </li>
          <li>
            <img
              alt="pinterest logo"
              src={`${process.env.PUBLIC_URL}/images/icon-pinterest.svg`}
            />
          </li>

          <li>
            <img
              alt="instagram, logo"
              src={`${process.env.PUBLIC_URL}/images/icon-instagram.svg`}
            />
          </li>
        </ul>
        {/*  Challenge by
        <a href="https://www.frontendmentor.io?ref=challenge">
          Frontend Mentor
        </a>
        . Coded by <a href="https://github.com/glowes">Clovis Veiga</a>.
       */}
      </div>
    </footer>
  );
}
export default App;
