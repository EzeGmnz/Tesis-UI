/* eslint-disable @next/next/no-img-element */
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
    Button,
    Fade,
    IconButton,
    InputAdornment,
    Modal,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import { grey } from '@mui/material/colors';
import Image from 'next/image';
import { useState } from 'react';
import dec from '../../public/dec.svg';
import GalaxyIcon from '../../public/Galaxy_icon.svg';
import ra from '../../public/ra.svg';
import { Coordinate } from '../types';

interface RegionInputProps {
    onCoordinatesSet: (coordinates: Coordinate[], mock: number) => void;
}

export default function RegionInput({ onCoordinatesSet }: RegionInputProps) {
    const [coordinates, setCoordinates] = useState<Partial<Coordinate>[]>([{}, {}]);
    const [mock, setMock] = useState(0);

    /**
     * Error state
     */
    const [errorCoord1, setErrorCoord1] = useState(false);
    const [errorCoord2, setErrorCoord2] = useState(false);

    const onChange = (index: number, coordinate: Partial<Coordinate>) => {
        const newCoordinates = [...coordinates];

        newCoordinates[index] = coordinate;

        setCoordinates(newCoordinates);
    };

    const onSubmit = () => {
        if (validate()) {
            onCoordinatesSet(coordinates as Coordinate[], mock);
        }
    };

    const validate = () => {
        const errorCoordinate1 = !coordinates[0].ra || !coordinates[0].dec;
        const errorCoordinate2 = !coordinates[1].ra || !coordinates[1].dec;

        setErrorCoord1(errorCoordinate1);
        setErrorCoord2(errorCoordinate2);

        return !errorCoordinate1 && !errorCoordinate2;
    };

    const autoComplete = (coord1: Coordinate, coord2: Coordinate, mock: number) => {
        setCoordinates([coord1, coord2]);
        setMock(mock);
    };

    return (
        <Stack spacing={3} style={{ display: 'flex', flexDirection: 'column' }}>
            <CoordinateInput
                onChange={(c) => onChange(0, c)}
                error={errorCoord1}
                title='Primer coordenada'
                coordinate={coordinates[0]}
            />
            <CoordinateInput
                onChange={(c) => onChange(1, c)}
                error={errorCoord2}
                title='Segunda coordenada'
                coordinate={coordinates[1]}
            />

            <Button onClick={onSubmit} variant='contained'>
                Consultar
            </Button>

            {/* Region coordinates autocomplete */}
            <Stack direction={'row'} spacing={1}>
                <Button
                    onClick={() =>
                        autoComplete(
                            { ra: 339.06204, dec: 33.99082 },
                            { ra: 338.95632, dec: 33.9296 },
                            1,
                        )
                    }
                    startIcon={<Image width={30} height={30} src={GalaxyIcon} />}
                    sx={{ flex: '1' }}
                    color='success'
                    variant='contained'
                >
                    Quinteto de Stephan
                </Button>
                <Button
                    onClick={() =>
                        autoComplete(
                            { ra: 37.24124, dec: 0.37942 },
                            { ra: 37.21113, dec: 0.3584 },
                            2,
                        )
                    }
                    startIcon={<Image width={30} height={30} src={GalaxyIcon} />}
                    sx={{ flex: '1' }}
                    color='success'
                    variant='contained'
                >
                    UGC 01962
                </Button>
            </Stack>
        </Stack>
    );
}

function CoordinateInput({
    onChange,
    error,
    title,
    coordinate,
}: {
    onChange: (c: Partial<Coordinate>) => void;
    error: boolean;
    title: string;
    coordinate: Partial<Coordinate>;
}) {
    const [modalInfoOpen, setModalInfoOpen] = useState(false);

    return (
        <div>
            {/* Title */}
            <Typography color={grey[400]} fontWeight='light' sx={{ m: 1 }}>
                {title}
                <span style={{ marginLeft: '5px', marginTop: 'auto', marginBottom: 'auto' }}>
                    <IconButton onClick={() => setModalInfoOpen(true)}>
                        <InfoOutlinedIcon />
                    </IconButton>
                </span>
            </Typography>

            {/* Dec and ra input */}
            <Stack direction='row' spacing={2} sx={{ textAlign: 'center' }}>
                <TextField
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <Image src={ra} height={30} width={40} />
                            </InputAdornment>
                        ),
                    }}
                    value={coordinate.ra}
                    error={error}
                    onChange={(e) => onChange({ ...coordinate, ra: +e.target.value })}
                    placeholder='Ascención recta'
                />
                <TextField
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <Image src={dec} height={30} width={40} />
                            </InputAdornment>
                        ),
                    }}
                    value={coordinate.dec}
                    error={error}
                    onChange={(e) => onChange({ ...coordinate, dec: +e.target.value })}
                    placeholder='Declinación'
                />

                {/* Info Dialog */}
                <Modal
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                    open={modalInfoOpen}
                    onClose={() => setModalInfoOpen(false)}
                    aria-labelledby='modal-modal-title'
                    aria-describedby='modal-modal-description'
                >
                    <Fade in={modalInfoOpen}>
                        <Box sx={style}>
                            <Typography
                                fontWeight={'bold'}
                                id='modal-modal-title'
                                variant='h6'
                                component='h2'
                            >
                                Ingreso de Coordenadas
                            </Typography>
                            <Typography
                                color={grey[300]}
                                textAlign={'justify'}
                                id='modal-modal-description'
                                sx={{ mt: 2 }}
                            >
                                Ambas coordenadas deben ser del sistema de{' '}
                                <b>coordenadas ecuatoriales</b>, en grados. La primer coordenada se
                                corresponde con un extremo de la diagonal del rectángulo de la
                                región a estudiar y la segunda coordenada al extremo opuesto, sin
                                importar el orden.
                            </Typography>
                            <Typography
                                color={grey[300]}
                                textAlign={'justify'}
                                id='modal-modal-description'
                                sx={{ mt: 2 }}
                            >
                                Por ejemplo, para delimitar la región del Quinteto de Stephan se
                                ingresan las siguientes coordenadas:
                            </Typography>
                            <div
                                style={{
                                    marginTop: '20px',
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <span>α 339.0620 δ 33.9908</span>
                                <img
                                    alt='Imagen de galaxias'
                                    src='/stephans.jpg'
                                    style={{ objectFit: 'contain' }}
                                    width={'70%'}
                                />
                                <span style={{ marginTop: 'auto' }}>α 338.9563 δ 33.9296</span>
                            </div>
                        </Box>
                    </Fade>
                </Modal>
            </Stack>
        </div>
    );
}
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
