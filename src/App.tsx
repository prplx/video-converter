import React, { useState, useCallback, useMemo } from 'react';
import {
  Grommet,
  Heading,
  Grid,
  Box,
  Select,
  Button,
  Text,
  Meter,
  ResponsiveContext,
} from 'grommet';
import { Update } from 'grommet-icons';
import { useDropzone } from 'react-dropzone';
import styled, { keyframes } from 'styled-components';
import {
  updateSource,
  generateFileNames,
  getDropStatusMessage,
  getValidationErrors,
} from './helpers';
import { AVAILABLE_FORMATS, AVAILABLE_RESOLUTIONS } from './constants';

const App: React.FC = () => {
  const [videoFormats, setVideoFormats] = useState([AVAILABLE_FORMATS[0]]);
  const [videoResolutions, setVideoResolutions] = useState([
    AVAILABLE_RESOLUTIONS[0],
  ]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [pending, setPending] = useState(false);
  const onDrop = useCallback(acceptedFiles => setVideoFiles(acceptedFiles), []);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop, accept: 'video/*', multiple: false });
  const videoObjectURL: string | undefined = useMemo(() => {
    if (!videoFiles.length) return;

    return URL.createObjectURL(videoFiles[0]);
  }, [videoFiles]);
  const validationErrors: string[] = useMemo(
    () => getValidationErrors(videoFormats, videoResolutions, videoFiles),
    [videoFiles, videoFormats, videoResolutions],
  );

  return (
    <Grommet>
      <ResponsiveContext.Consumer>
        {size => (
          <Wrapper>
            <Grid
              fill
              rows={
                size === 'small'
                  ? ['72px', 'auto', 'auto', '60px']
                  : ['72px', 'auto', '60px']
              }
              columns={size === 'small' ? ['full'] : ['1/2', '1/2']}
              gap="none"
              areas={getAreas(size)}>
              <Box
                gridArea="header"
                background="brand"
                pad="medium"
                justify="center">
                <Heading margin="none" level={2}>
                  Video converter
                </Heading>
              </Box>
              <Box
                gridArea="main"
                background="light-2"
                pad={{ vertical: 'large', horizontal: 'medium' }}>
                <Box margin={{ bottom: '1em' }}>
                  <Heading level={4} margin="none">
                    Выберите форматы:
                  </Heading>
                  <Select
                    options={AVAILABLE_FORMATS}
                    multiple
                    value={videoFormats}
                    closeOnChange={false}
                    onChange={({ option }) =>
                      updateSource(option, videoFormats, setVideoFormats)
                    }
                    messages={{ multiple: videoFormats.join(', ') }}
                    margin={{ top: '1em', bottom: '2em' }}
                  />
                </Box>
                <Box margin={{ bottom: '2em' }}>
                  <Heading level={4} margin="none">
                    Выберите разрешения:
                  </Heading>
                  <Select
                    options={AVAILABLE_RESOLUTIONS}
                    multiple
                    closeOnChange={false}
                    value={videoResolutions}
                    onChange={({ option }) =>
                      updateSource(
                        option,
                        videoResolutions,
                        setVideoResolutions,
                      )
                    }
                    messages={{ multiple: videoResolutions.join(', ') }}
                    margin={{ top: '1em', bottom: '1em' }}
                  />
                </Box>
                <Box margin={{ bottom: '2em' }}>
                  <Heading level={4} margin="none">
                    Выберите файл:
                  </Heading>
                  <DropZoneWrapper {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>
                      {getDropStatusMessage(
                        isDragActive,
                        isDragReject,
                        isDragAccept,
                      )}
                    </p>
                  </DropZoneWrapper>
                  <Box margin={{ top: '1em' }} height="56.250px">
                    <video src={videoObjectURL} width="100px" />
                  </Box>
                </Box>
                <Box align="start" height="3em">
                  <Button
                    disabled={!!validationErrors.length || pending}
                    fill="vertical"
                    primary
                    label="Конвертировать"
                    icon={
                      <Spinner animate={pending}>
                        <Update color="#f8f8f8" />
                      </Spinner>
                    }
                    onClick={() => setPending(true)}
                  />
                </Box>
              </Box>

              <Box
                gridArea="result"
                background="light-2"
                pad={{ vertical: 'large', horizontal: 'medium' }}>
                <Box margin={{ bottom: '3em' }}>
                  <Heading level={4} margin={{ bottom: '1em', top: 'none' }}>
                    Результат:
                  </Heading>
                  {validationErrors.map((error: string) => (
                    <Text key={error} color="status-error">
                      {error}
                    </Text>
                  ))}
                  {!validationErrors.length && (
                    <List>
                      {generateFileNames(
                        videoFiles[0].name,
                        videoFormats,
                        videoResolutions,
                      ).map((name, i) => (
                        <ListItem
                          text={`${i + 1}. ${name}`}
                          key={name}
                          pending={pending}
                        />
                      ))}
                    </List>
                  )}
                </Box>
              </Box>
              <Box
                gridArea="footer"
                background="light-6"
                pad="medium"
                justify="center">
                <Text size="small">Made by @prplx at GeekBrains</Text>
              </Box>
            </Grid>
          </Wrapper>
        )}
      </ResponsiveContext.Consumer>
    </Grommet>
  );
};

const List: React.FC = props => <Box tag="ul" border="top" {...props} fill />;

const ListItem: React.FC<{ text: string; pending: boolean }> = ({
  text,
  pending,
}) => (
  <Box tag="li" border="bottom" pad="small" direction="row" justify="between">
    <Text>{text}</Text>
    {pending && (
      <Meter
        type="circle"
        background="light-3"
        values={[{ value: 30, label: '30', color: 'brand' }]}
        size="24px"
        thickness="4"
      />
    )}
  </Box>
);

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
`;

const DropZoneWrapper = styled.div`
  margin-top: 1em;
  padding: 16px;
  border-radius: 8px;
  border: 2px dashed #7d4cdb;
  color: #7d4cdb;
  text-align: center;

  &:hover {
    cursor: pointer;
  }
`;

const spinKeyframes = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled(Box)<{ animate: boolean }>`
  animation: ${spinKeyframes} 1s infinite linear;
  animation: ${({ animate }) => !animate && 'none'};
`;

const getAreas = (size: string) =>
  size === 'small'
    ? [
        { name: 'header', start: [0, 0], end: [1, 0] },
        { name: 'main', start: [0, 1], end: [1, 1] },
        { name: 'result', start: [0, 2], end: [1, 2] },
        { name: 'footer', start: [0, 3], end: [1, 3] },
      ]
    : [
        { name: 'header', start: [0, 0], end: [1, 0] },
        { name: 'main', start: [0, 1], end: [1, 1] },
        { name: 'result', start: [1, 1], end: [1, 1] },
        { name: 'footer', start: [0, 2], end: [1, 2] },
      ];

export default App;
