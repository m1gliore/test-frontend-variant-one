import React, {useEffect, useState} from 'react';
import {fetchRandomImage} from '../apiCalls/Images';
import styled from 'styled-components';
import {TextField, Button} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {trends} from "../lib/Trends";

const Home: React.FC = () => {
    const [previewImage, setPreviewImage] = useState<string>('');
    const [photographer, setPhotographer] = useState<string>('');
    const [photographerUrl, setPhotographerUrl] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [randomWords, setRandomWords] = useState<string[]>([]);

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

    const handleSearch = () => {
        if (searchQuery) {
            // Добавьте код для обработки поискового запроса
            console.log('Выполняется поиск по запросу:', searchQuery);
            setSearchQuery('');
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
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
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
`;

const SearchContainer = styled.div`
  position: absolute;
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
  left: 50%;
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

export default Home;
