import className from "classnames";
import { GoBell, GoCloudDownload, GoDatabase } from 'react-icons/go';
import Button from '../components/Button';
import {useState, useEffect, Fragment} from 'react';
function Services() {
    const myClassName = className("py-8 px-8 max-w-lg mx-auto bg-white rounded-xl shadow-lg space-y-2 lg:py-4 lg:flex lg:items-center lg:space-y-0 lg:space-x-6")
    
    const handleClick = () => {
        console.log("My first custom Button component works!");
    }

    const rssFeed = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.mortgagenewsdaily.com/rss/rates'

    const MAX_ARTICLES = 10;
    const [articles, setArticles] = useState();
    useEffect(() => {
        const loadArticles = async () => {
            fetch(rssFeed, { headers: { Accept: 'application/json' } })
            .then((res) => res.json())
            .then((data) => data.items.filter((item) => item.title.length > 0))
            .then((newArticles) => newArticles.slice(0, MAX_ARTICLES))
            .then((articles) => setArticles(articles))
            .catch((error) => console.log(error));
            };
        loadArticles();
    }, [MAX_ARTICLES]);

    const content = articles
        ? articles.map((item) => (
        <Fragment>
        <div className='card' style={{display:'grid', gridTemplateColumns:'1fr'}}>
            <a className="link" href={item.link} target="_blank" rel="nofollow noopener noreferrer"
                aria-label={item.link} key={item.link}>
                <h5 className="card-img-top font-bold text-3xl centered-text">
                    {item.title + ' - Published on MBD on: '+item.pubDate.slice(0,10)}
                </h5>
            </a>
            <div className="card-hdr">
            </div>
            <div className="card-body" >
                {/* <h5 className="card-title">{item.title}</h5> */}
                <div className="card-text" style={{gridColumn:'1/3'}}>
                    <p className='main-text max-text-box'>{item.description}</p>
                </div>
            </div>
            <br/>
            {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
        </div>
        </Fragment>

        ))
        : "no article shown";

    return (
        <div className="mt-8">
            <h3 className="heading-primary centered-text">Mortgage News from Mortgage News Daily</h3>
            {content}
            <br/>
            {/* <span className="text-2xl font-bold py-8 px-8 max-w-lg mx-auto bg-white rounded-xl shadow-lg space-y-2 lg:py-4 lg:flex lg:items-center lg:space-y-0 lg:space-x-6">More details coming soon...</span> */}
            <div className={myClassName}>
                <img className="block mx-auto h-24 rounded-full lg:mx-0 lg:shrink-0" src={require("../img/shachiHeadShot.png")} alt="Woman's Face" />
                <div className="text-center space-y-2 lg:text-left">
                    <div className="space-y-0.5">
                    <p className="text-3xl text-black font-semibold">
                        Shachi Bhardwaj
                    </p>
                    <p className="text-slate-500 font-medium mb-3 text-2xl">
                        Mortgage Banker
                    </p>
                    </div>
                    <span className="text-2xl text-black">If you are considering purchasing a home and would like to understand better your loan options, please contact me at 
                    <a href="https://banksouthmortgage.com/loan-officer/shachi-bhardwaj/" target="_blank" rel="noopener noreferrer"
                            className="text-purple-600 text-2xl font-semibold">&nbsp;shachibhardwaj.com.</a></span>
                    <Button rounded className="hidden mb-5 px-4 py-1 text-xl text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2" onClick={handleClick}>
                        <GoBell />
                        Click me!!
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Services;