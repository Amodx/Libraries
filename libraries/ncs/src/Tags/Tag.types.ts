/**
 * Interface representing the meta data of a tag.
 */
export interface TagMetaData {
  name: string;
  description?: string;
  [key: string]: any;
}


/**
 * Type representing the data required to register a tag.
 */
export type TagRegisterData = {
  /**
   * The type of the tag.
   */
  id: string;
  /**
   * The shared meta data of all tags.
   */
  meta?: TagMetaData;
};


