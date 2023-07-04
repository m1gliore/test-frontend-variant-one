import React, {useEffect, useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {CloudDownloadOutlined} from "@mui/icons-material";
import styled from "styled-components";
import {ImageData} from "../types/ImageData";
import {searchImages} from "../apiCalls/Images";
import {useLocation} from "react-router-dom";

const Search: React.FC = () => {
    const [images, setImages] = useState<ImageData[]>([]);
    const [page, setPage] = useState<number>(1);
    const query = useLocation().pathname.split('/')[2]

    useEffect(() => {
        (async () => {
            const fetchedImages = await searchImages(query, page);
            setImages((prevImages) => [...prevImages, ...fetchedImages]);
        })();
    }, [page, query]);

    const fetchMoreImages = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handleDownload = (imageUrl: string) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("download", "image.jpg");
        link.click();
    };

    return (
        <div>
            <ImageGridContainer>
                <InfiniteScroll
                    dataLength={images.length}
                    next={fetchMoreImages}
                    hasMore={true}
                    loader={<Loader>Loading...</Loader>}
                >
                    {images.map((image, index) => (
                        <ImageContainer key={index}>
                            <Image src={image.imageUrl}/>
                            <DownloadButton onClick={() => handleDownload(image.imageUrl)}>
                                <CloudDownloadOutlined/>
                            </DownloadButton>
                            <AuthorLink href={image.photographerUrl} target="_blank" rel="noopener noreferrer">
                                {image.photographer}
                            </AuthorLink>
                        </ImageContainer>
                    ))}
                </InfiniteScroll>
            </ImageGridContainer>
        </div>
    )
}

const ImageGridContainer = styled.div`
  position: absolute;
  top: 5vh;
  overflow-y: auto;
`;

const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #888;
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

const Image = styled.img`
  width: calc(100% / 3);
  cursor: pointer;
  margin-bottom: 1vw;

  &:hover {
    opacity: .8;
  }
`;

const DownloadButton = styled.div`
  position: absolute;
  bottom: 0;
  right: 33%;
  padding: 1.5vw;
  color: #fff;
  z-index: 15;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const AuthorLink = styled.a`
  position: absolute;
  bottom: 0;
  left: 33%;
  padding: 1.5vw;
  color: #fff;
  text-decoration: none;
  font-size: 1.2rem;
  z-index: 2;

  &:hover {
    opacity: 0.8;
  }
`;

export default Search