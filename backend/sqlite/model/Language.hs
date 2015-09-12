module Language where

import ClassyPrelude.Yesod

data Language = Engish | Esperanto | French
   deriving (Show, Read, Eq)
derivePersistField "Language"

