interface RegionImageProps {
    alt: string;
    onLoad?: () => void;
    url: string;
    show: boolean;
}

export default function RegionImage({ show, url, alt, onLoad }: RegionImageProps) {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            style={{ zIndex: '2', objectFit: 'contain' }}
            onLoad={onLoad}
            src={url + `&no-cache-str=${Date.now()}`}
            width={show ? 500 : 0}
            height={show ? 500 : 0}
            alt={alt}
        />
    );
}
