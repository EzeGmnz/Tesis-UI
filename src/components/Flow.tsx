import { Button, CircularProgress } from '@mui/material';
import { grey } from '@mui/material/colors';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Coordinate } from '../types';
import { GET } from '../utils';
import RegionImage from './RegionImage';
import RegionInput from './RegionInput';

// 339.06204, 33.99082
// 338.95632, 33.92960

// 179.75077, -0.45269
// 179.75475, -0.44709

interface CoordinatesData {
    coordinates: Coordinate[];
    mock?: number;
}

export default function Flow() {
    const [coordinatesData, setCoordinatesData] = useState<CoordinatesData | undefined>(undefined);
    const [loadingClassifications, setLoadingClassifications] = useState(true);

    const reset = () => {
        setCoordinatesData(undefined);
        setLoadingClassifications(true);
    };

    return (
        <>
            <div style={{ marginTop: '20px' }}>
                {coordinatesData ? (
                    <div
                        style={{
                            overflow: 'hidden',
                            display: 'flex',
                            backgroundColor: grey[900],
                            borderRadius: 10,
                            position: 'relative',
                            height: 500,
                            width: 500,
                        }}
                    >
                        {/* Region image */}
                        <RawImage
                            coords={coordinatesData.coordinates!}
                            loadingClassifications={loadingClassifications}
                        />

                        {/* Image with classifications */}
                        <ImageWithClassifications
                            mock={coordinatesData.mock}
                            coords={coordinatesData.coordinates!}
                            onLoaded={() => setLoadingClassifications(false)}
                        />
                    </div>
                ) : (
                    <RegionInput
                        onCoordinatesSet={(c, mock) => {
                            setCoordinatesData({
                                coordinates: c,
                                mock,
                            });
                        }}
                    />
                )}
            </div>

            {/* Loading Message */}
            {coordinatesData && loadingClassifications && <LoadingMessage />}

            {/* Button reset */}
            {!loadingClassifications && (
                <Button
                    variant='contained'
                    onClick={reset}
                    fullWidth
                    style={{ maxWidth: 500, marginTop: '10px' }}
                >
                    Consultar por otra región
                </Button>
            )}
        </>
    );
}

function LoadingMessage() {
    const [messageIndex, setMessageIndex] = useState(0);

    const messages = [
        'Obteniendo Imagen',
        'Buscando regiones de interés',
        'Filtrando regiones de interés',
        'Clasificando',
        'Construyendo el resultado',
    ];

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessageIndex((currentIndex) => (currentIndex + 1) % messages.length);
        }, 2000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div style={{ marginTop: '5px', display: 'flex', justifyContent: 'center' }}>
            <AnimatePresence mode='wait'>
                <motion.span
                    style={{ fontSize: '1.1rem' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={messageIndex}
                >
                    {messages[messageIndex]}
                </motion.span>
            </AnimatePresence>
        </div>
    );
}

function RawImage({
    coords,
    loadingClassifications,
}: {
    coords: Coordinate[];
    loadingClassifications: boolean;
}) {
    const [sdssUrl, setSdssUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        const getFlaskUrl = () => {
            return (
                process.env.NEXT_PUBLIC_FLASK_SERVER +
                `/image-url?ra1=${coords[0].ra}&dec1=${coords[0].dec}&ra2=${coords[1].ra}&dec2=${coords[1].dec}`
            );
        };

        const fetchImageUrl = async () => {
            const json = await GET(getFlaskUrl());

            return json.url;
        };

        fetchImageUrl().then((url) => {
            setSdssUrl(url);
        });
    }, [coords]);

    return (
        <>
            <LoadingRawImage />
            {loadingClassifications && <LoadingClassifications />}

            {sdssUrl && (
                <RegionImage
                    show={loadingClassifications}
                    onLoad={() => {}}
                    url={sdssUrl}
                    alt='imagen de la región'
                />
            )}
        </>
    );
}

function LoadingRawImage() {
    return (
        <div
            style={{
                zIndex: '1',
                position: 'absolute',
                right: 'calc(500px - 20px - 50%)',
                top: 'calc(500px - 22px - 50%)',
            }}
        >
            <CircularProgress />
        </div>
    );
}

function LoadingClassifications() {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        setWidth(100);
    }, []);

    return (
        <motion.div
            animate={{ width: `${width}%` }}
            transition={{ type: 'tween', duration: 20 }}
            style={{
                zIndex: '3',
                position: 'absolute',
                backgroundColor: grey[100],
                opacity: 0.1,
                height: '100%',
            }}
        />
    );
}

function ImageWithClassifications({
    coords,
    onLoaded,
    mock,
}: {
    coords: Coordinate[];
    onLoaded: () => void;
    mock?: number;
}) {
    const [loaded, setLoaded] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        setLoaded(false);
        setImageUrl(undefined);

        console.log('refreshed');

        const getFlaskUrl = () => {
            return (
                process.env.NEXT_PUBLIC_FLASK_SERVER +
                `/?ra1=${coords[0].ra}&dec1=${coords[0].dec}&ra2=${coords[1].ra}&dec2=${coords[1].dec}&mock=${mock}`
            );
        };

        setImageUrl(getFlaskUrl());
    }, [coords]);

    const onLoad = () => {
        setLoaded(true);
        onLoaded();
    };

    return (
        <>
            {imageUrl && (
                <RegionImage
                    alt='imagen clasificada'
                    url={imageUrl!}
                    show={loaded}
                    onLoad={onLoad}
                />
            )}
        </>
    );
}
