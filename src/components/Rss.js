
import {useState, useEffect, Fragment} from 'react';
import {parseDate} from './util';
import Skeleton from './Skeleton';
import classNames from 'classnames';

function Rss ({max, titleOnly, classFromParent}) {
    const rssFeed = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.mortgagenewsdaily.com/rss/rates'

    const MAX_ARTICLES = 10;
    const [articles, setArticles] = useState();
    const title1ClassName= classNames("card-img-top font-bold pt-2 tracking-wide", classFromParent);
    const title2ClassName= classNames("font-normal italic text-1xl tracking-wide",classFromParent);

    // console.log(title2ClassName, typeof(title2ClassName));
    useEffect(() => {
        // console.log(articles);
        const loadArticles = async () => {
            fetch(rssFeed, { headers: { Accept: 'application/json' } })
            .then((res) => res.json())
            .then((data) => data.items.filter((item) => item.title.length > 0))
            .then((newArticles) => newArticles.slice(0, max))
            .then((articles) => setArticles(articles))
            .catch((error) => console.log(error));
            };
        loadArticles();
        // console.log(articles);
    }, []);

    // console.log(articles);
    const content = articles
        ? articles.map((item, idx) => (
        <div key={idx} className='card border-y-1  mb-2' style={{display:'grid', gridTemplateColumns:'1fr', border:'none', backgroundColor:'var(--bgColorPrimary)'}}>
            <a className="link" href={item.link} target="_blank" rel="nofollow noopener noreferrer"
                aria-label={item.link} key={item.link} style={{textDecoration:'none'}}>
                <h5 className={title1ClassName}>{item.title}
                    <p style={{fontSize:'1.6rem'}} className={title2ClassName}>{'Published on MBD on '+parseDate(item.pubDate)}</p>
                </h5>
            </a>
            <div className="card-hdr">
            </div>
            <div className="card-body">
                {/* <h5 className="card-title">{item.title}</h5> */}
                <div className="card-text" style={{gridColumn:'1/3'}}>
                    <p className='main-text max-text-box'>{titleOnly?'':item.description}</p>
                </div>
            </div>
            <hr style={{height: '1px', width:'100%'}}/>
            {titleOnly?'':<br/>}
            {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
        </div>

        ))
        : <Skeleton times={10}/>

    return (
        <Fragment>
            {content}
        </Fragment>
    )

};
export default Rss;
