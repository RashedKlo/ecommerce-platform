import React, { useRef, useEffect, useState } from 'react';

const LazyLoadImage = ({ src, alt, style, onClick }) => {
    const [loaded, setLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const imgRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target); // Stop observing after loading
                    }
                });
            },
            {
                rootMargin: '50px', // Start loading before the image is in view
                threshold: 0.1, // Trigger when 10% of the image is visible
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, []);

    return (
        <img
            ref={imgRef}
            src={isVisible ? src : ''}
            alt={alt}
            onClick={onClick}
            style={{
                ...style,
                opacity: loaded ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                backgroundColor: '#f0f0f0',
            }}
            onLoad={() => setLoaded(true)}
        />
    );
};

export default LazyLoadImage;
