module Utilities
where

import Prelude
import Text.Read

mightRead :: (Read r) => Maybe String -> Maybe r
mightRead = (readMaybe =<<)

-- vim:set expandtab:
