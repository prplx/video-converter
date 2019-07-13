import { gql } from 'apollo-boost';

export const GET_ASSET = gql`
  query getAsset($id: ID!) {
    assets {
      one(id: $id) {
        status
        asset {
          state
          service
          title
          attacheName
          files {
            id
            downloadUrl
            size
            mimeType
            checksum {
              md5
              sha1
              sha3
            }
            state
            meta {
              key
              value
            }
            systemTags
            createdAt
            updatedAt
          }
        }
      }
    }
  }
`;

export const CREATE_ASSET = gql`
  mutation createAsset(
    $title: String!
    $tags: [String!]!
    $transform: AssetsTransformVideo
    $meta: [MetaDataIn!]
  ) {
    assets {
      createVideo(
        title: $title
        tags: $tags
        transform: $transform
        meta: $meta
      ) {
        id
        status
        uploadUrl
      }
    }
  }
`;
