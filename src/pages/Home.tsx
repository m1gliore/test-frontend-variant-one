import React, {useEffect, useState} from 'react';
import {fetchRandomImage, fetchImages} from '../apiCalls/Images';
import styled from 'styled-components';
import {TextField, Button} from '@mui/material';
import { CloudDownloadOutlined } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import {trends} from "../lib/Trends";
import InfiniteScroll from 'react-infinite-scroll-component';
import {ImageData} from "../types/ImageData";
import {useNavigate} from "react-router-dom";

const Home: React.FC = () => {
    const [previewImage, setPreviewImage] = useState<string>('');
    const [photographer, setPhotographer] = useState<string>('');
    const [photographerUrl, setPhotographerUrl] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [randomWords, setRandomWords] = useState<string[]>([]);
    const [images, setImages] = useState<ImageData[]>([]);
    const [page, setPage] = useState<number>(1);
    const navigate = useNavigate()

    const getRandomWords = (count: number | undefined) => {
        const shuffledWords = trends.sort(() => 0.5 - Math.random());
        return shuffledWords.slice(0, count);
    };

    useEffect(() => {
        (async () => {
            const imageData = await fetchRandomImage();
            if (imageData) {
                setPreviewImage(imageData.imageUrl);
                setPhotographer(imageData.photographer);
                setPhotographerUrl(imageData.photographerUrl);
            }
        })();
    }, []);

    useEffect(() => {
        if (!searchQuery) {
            const words = getRandomWords(7);
            setRandomWords(words);
        }
    }, [searchQuery]);

    useEffect(() => {
        (async () => {
            const fetchedImages = await fetchImages(page);
            setImages((prevImages) => [...prevImages, ...fetchedImages]);
        })();
    }, [page]);

    const handleSearch = () => {
        if (searchQuery) {
            const encodedQuery = encodeURIComponent(searchQuery);
            navigate(`/search/${encodedQuery}`);
            setSearchQuery('');
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

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
        <Container>
            {previewImage && <BackgroundImage src={previewImage}/>}
            <Content>
                {photographer && (
                    <PhotographerLink href={photographerUrl} target="_blank" rel="noopener noreferrer">
                        Автор фото - {photographer}
                    </PhotographerLink>
                )}
                <Text>Лучшие бесплатные стоковые фото, изображения без роялти и видео от талантливых авторов.</Text>
                <SearchContainer>
                    <StyledTextField
                        label="Поиск"
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value)}
                        onKeyPress={handleKeyPress}
                        InputProps={{
                            sx: {
                                color: '#000',
                                '& fieldset': {
                                    borderColor: '#fff',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#fff',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#fff',
                                }
                            }
                        }}
                        InputLabelProps={{
                            sx: {
                                color: '#000',
                            }
                        }}
                    />
                    <SearchButton onClick={handleSearch}>
                        <SearchIcon/>
                    </SearchButton>
                </SearchContainer>
                <RandomWords>
                    Тенденции: {randomWords.map((word, index) => (
                    <React.Fragment key={index}>
                        <WordLink
                            href={`/search/${encodeURIComponent(word)}`}>{word}{index !== randomWords.length - 1 && ","}</WordLink>
                    </React.Fragment>
                ))}
                </RandomWords>
            </Content>
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
        </Container>
    );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  max-height: fit-content;
`;

const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60vh;
  opacity: 0.8;
  z-index: 1;
`;

const Content = styled.div`
  z-index: 5;
`;

const PhotographerLink = styled.a`
  position: absolute;
  top: 55vh;
  right: 1vw;
  color: #fff;
  text-decoration: none;
  font-size: 1.2rem;
  z-index: 2;

  &:hover {
    opacity: 0.8;
  }
`;

const Text = styled.h1`
  position: absolute;
  margin: 0;
  z-index: 10;
  width: 25vw;
  top: 20%;
  left: 48%;
  transform: translate(-50%, -50%);
  color: #fff;
`;

const SearchContainer = styled.div`
  position: fixed;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const StyledTextField = styled(TextField)`
  width: 25vw;
`;

const SearchButton = styled(Button)`
  margin-left: 1vw;
`;

const RandomWords = styled.span`
  position: absolute;
  margin: 0;
  z-index: 10;
  width: 25vw;
  top: 40%;
  left: 48%;
  transform: translate(-50%, -50%);
  color: #fff;
  cursor: pointer;
  white-space: nowrap;
`;

const WordLink = styled.a`
  margin-right: .5rem;
  text-decoration: none;
  color: #fff;
  cursor: pointer;

  &:hover {
    opacity: .5;
  }
`;

const ImageGridContainer = styled.div`
  position: absolute;
  top: 65vh;
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

export default Home;
