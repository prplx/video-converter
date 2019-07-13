import React, { useCallback, useMemo, useReducer } from 'react';
import { useMutation, useApolloClient } from 'react-apollo-hooks';
import {
  Grommet,
  Heading,
  Grid,
  Box,
  Select,
  Button,
  Text,
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
  generateResult,
  updateResult,
  getAreas,
} from './helpers';
import { AvailableFormats, AvailableResolutions } from './constants';
import reducer, { IState } from './reducer';
import {
  ActionTypes,
  ConversionState,
  ASSET_TAG,
  CONVERSION_TIMEOUT,
} from './constants';
import { GET_ASSET, CREATE_ASSET } from './apollo/queries';
import { getAsset_assets, getAsset } from './apollo/types/getAsset';
import { createAsset_assets } from './apollo/types/createAsset';
import { IFileResult } from './types';
import { createAsset, uploadFile, pollConversionStatus } from './api';
import './index.css';

const initialState: IState = {
  error: '',
  statusMessage: '',
  pending: false,
  files: [],
  formats: [AvailableFormats.MP4],
  resolutions: [AvailableResolutions.R360P],
  conversionState: ConversionState.IDLE,
  result: [],
};

const App: React.FC = () => {
  const client = useApolloClient();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { files, formats, resolutions } = state;
  const dispatchError = (text: string) =>
    dispatch({ type: ActionTypes.SET_ERROR, payload: text });
  const dispatchSetResult = (payload: IFileResult[] | undefined) =>
    dispatch({
      type: ActionTypes.SET_RESULT,
      payload,
    });
  const onDrop = useCallback(
    acceptedFiles => {
      dispatch({ type: ActionTypes.SET_FILES, payload: acceptedFiles });
      dispatchSetResult(
        generateResult(generateFileNames(formats, resolutions)),
      );
    },
    [formats, resolutions],
  );
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: 'video/*',
    multiple: false,
    disabled: state.pending,
  });
  const videoObjectURL: string | undefined = useMemo(() => {
    if (!files.length) return;

    return URL.createObjectURL(files[0]);
  }, [files]);

  const validationErrors: string[] = useMemo(
    () => getValidationErrors(formats, resolutions, files),
    [files, formats, resolutions],
  );

  const createAssetMutation = useMutation<createAsset_assets>(CREATE_ASSET);

  const convert = async () => {
    dispatch({ type: ActionTypes.SET_PENDING, payload: true });
    try {
      const { id, uploadUrl } = await createAsset(createAssetMutation, {
        title: files[0].name,
        tags: [ASSET_TAG],
        transform: { format: formats, resolution: resolutions },
      });

      await uploadFile(state.files[0], uploadUrl, (progress: number) =>
        dispatch({
          type: ActionTypes.SET_UPLOADING_PROGRESS,
          payload: progress,
        }),
      );

      dispatch({ type: ActionTypes.SET_CONVERTING });

      pollConversionStatus(
        () =>
          client.query<getAsset_assets>({
            query: GET_ASSET,
            variables: { id },
            fetchPolicy: 'no-cache',
          }),
        (result: getAsset, error: string, done: boolean) => {
          if (error) dispatchError(error);

          dispatchSetResult(updateResult(state.result, result));

          if (done) dispatch({ type: ActionTypes.SET_DONE });
        },
        CONVERSION_TIMEOUT,
      );
    } catch (error) {
      dispatchError(error.message);
    }
  };

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
                style={{ minHeight: '540px' }}
                pad={{ vertical: 'large', horizontal: 'medium' }}>
                <Box margin={{ bottom: '1em' }}>
                  <Heading level={4} margin="none">
                    Выберите форматы:
                  </Heading>
                  <Select
                    options={Object.keys(AvailableFormats)}
                    multiple
                    value={formats}
                    closeOnChange={false}
                    onChange={({ option }) =>
                      updateSource(option, formats, (next: string[]) => {
                        dispatch({
                          type: ActionTypes.SET_FORMATS,
                          payload: next,
                        });
                        dispatchSetResult(
                          generateResult(generateFileNames(next, resolutions)),
                        );
                      })
                    }
                    messages={{ multiple: formats.join(', ') }}
                    margin={{ top: '1em', bottom: '2em' }}
                    disabled={state.pending}
                  />
                </Box>
                <Box margin={{ bottom: '2em' }}>
                  <Heading level={4} margin="none">
                    Выберите разрешения:
                  </Heading>
                  <Select
                    options={Object.keys(AvailableResolutions)}
                    multiple
                    closeOnChange={false}
                    value={resolutions}
                    onChange={({ option }) =>
                      updateSource(option, resolutions, (next: string[]) => {
                        dispatch({
                          type: ActionTypes.SET_RESOLUTIONS,
                          payload: next,
                        });
                        dispatchSetResult(
                          generateResult(generateFileNames(formats, next)),
                        );
                      })
                    }
                    messages={{ multiple: resolutions.join(', ') }}
                    margin={{ top: '1em', bottom: '1em' }}
                    disabled={state.pending}
                  />
                </Box>
                <Box margin={{ bottom: '2em' }}>
                  <Heading level={4} margin="none">
                    Выберите файл:
                  </Heading>
                  <DropZoneWrapper
                    {...getRootProps({ disabled: state.pending })}>
                    <input {...getInputProps()} />
                    <p>
                      {getDropStatusMessage(
                        isDragActive,
                        isDragReject,
                        isDragAccept,
                      )}
                    </p>
                  </DropZoneWrapper>
                  <VideopreviewWrapper>
                    <video src={videoObjectURL} width="100px" />
                  </VideopreviewWrapper>
                </Box>
                <Box align="start" height="3em">
                  <Button
                    disabled={
                      !!validationErrors.length ||
                      state.pending ||
                      state.conversionState === ConversionState.DONE
                    }
                    fill="vertical"
                    primary
                    label="Конвертировать"
                    icon={
                      <Spinner animate={state.pending}>
                        <Update color="#f8f8f8" />
                      </Spinner>
                    }
                    onClick={convert}
                  />
                </Box>
              </Box>
              <Box
                gridArea="result"
                background="light-2"
                pad={{ vertical: 'large', horizontal: 'medium' }}>
                <Box margin={{ bottom: '3em' }}>
                  <Heading
                    alignSelf="stretch"
                    style={{ maxWidth: 'unset' }}
                    level={4}
                    margin={{ bottom: '1em', top: 'none' }}>
                    Статус:&nbsp;
                    {state.statusMessage && (
                      <Text weight="normal">{state.statusMessage}</Text>
                    )}
                    {state.error && (
                      <Text weight="normal" color="status-error">
                        {state.error}
                      </Text>
                    )}
                  </Heading>
                  {validationErrors.map((error: string) => (
                    <Text key={error} color="status-error">
                      {error}
                    </Text>
                  ))}
                  {!validationErrors.length && (
                    <List>
                      {state.result.map((file, i) => (
                        <ListItem
                          text={`${i + 1}. ${file.name}`}
                          url={file.downloadUrl}
                          progress={file.progress}
                          key={file.name}
                          pending={state.pending}
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

const ListItem: React.FC<{
  text: string;
  pending: boolean;
  url?: string;
  progress?: number;
}> = ({ text, pending, url, progress }) => (
  <Box
    style={{ height: '60px' }}
    align="center"
    tag="li"
    border="bottom"
    pad="small"
    direction="row"
    justify="between">
    <Text>{text}</Text>
    {pending && !!progress && !url && <Text>{progress}%</Text>}
    {url && <Button label="Скачать" primary target="_blank" href={url} />}
  </Box>
);

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
`;

const DropZoneWrapper = styled.div<any>`
  margin-top: 1em;
  padding: 16px;
  border-radius: 8px;
  border: ${props =>
    !props.disabled
      ? '2px dashed #7d4cdb'
      : '2px dashed rgba(125, 76, 219, .3)'};
  color: ${props => (!props.disabled ? '#7d4cdb' : 'rgba(125, 76, 219, .3)')};
  text-align: center;

  &:hover {
    cursor: pointer;
  }
`;

const VideopreviewWrapper = styled.div`
  display: none;
  height: 56.25px;
  margin-top: 1em;

  @media (min-height: 900px) {
    display: unset;
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

export default App;
