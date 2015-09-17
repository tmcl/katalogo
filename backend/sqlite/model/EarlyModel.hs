module EarlyModel where

import ClassyPrelude.Yesod

data Language = Engish | Esperanto | French | German
   deriving (Show, Read, Eq)
derivePersistField "Language"

data Holding = Held | Phantom | Lost | Discarded
   deriving (Show, Read, Eq)
derivePersistField "Holding"

data AuthorRole 
      = Author 
      | TextWriter 
      | Illustrator 
      | Translator 
      | Editor
      | Preparer
      | Compilor
      | Publisher
   deriving (Show, Read, Eq)
derivePersistField "AuthorRole"

-- vim:set expandtab:
