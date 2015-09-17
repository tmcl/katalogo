module Model where

import ClassyPrelude.Yesod
import Database.Persist.Quasi
import EarlyModel
import Utilities

-- You can define all of your database entities in the entities file.
-- You can find more information on persistent and how to declare entities
-- at:
-- http://www.yesodweb.com/book/persistent/
share [mkPersist sqlSettings, mkMigrate "migrateAll"]
    $(persistFileWith lowerCaseSettings "model/models")

instance ToJSON ImportedBook where
   toJSON ib = object [
      "note"                .= importedBookNote ib,
      "callnumber"          .= importedBookCallnumber ib,
      "title"               .= importedBookTitle ib,
      "original_language"   .= (the_language (importedBookOriginal_language ib)),
      "author_title_1"      .= importedBookAuthor_title_1 ib,
      "author_1"            .= importedBookAuthor_1 ib,
      "other_names_1"       .= importedBookOther_names_1 ib,
      "text_by"             .= importedBookText_by ib,
      "illustrator"         .= importedBookIllustrator ib,
      "author_2"            .= importedBookAuthor_2 ib,
      "author_3"            .= importedBookAuthor_3 ib,
      "author_4"            .= importedBookAuthor_4 ib,
      "translator_1"        .= importedBookTranslator_1 ib,
      "translator_2"        .= importedBookTranslator_2 ib,
      "editor_title_1"      .= importedBookEditor_title_1 ib,
      "editor_1"            .= importedBookEditor_1 ib,
      "editor_2"            .= importedBookEditor_2 ib,
      "preparer"            .= importedBookPreparer ib,
      "compilor_title"      .= importedBookCompilor_title ib,
      "compilor"            .= importedBookCompilor ib,
      "pagecount"           .= importedBookPagecount ib,
      "publisher"           .= importedBookPublisher ib,
      "year"                .= importedBookYear ib,
      "location"            .= importedBookLocation ib,
      "random_symbols"      .= importedBookRandom_symbols ib,
      "nothing"             .= importedBookNothing ib,
      "probably_irrelevant" .= importedBookProbably_irrelevant ib,
      "nothing_1"           .= importedBookNothing_1 ib,
      "nothing_2"           .= importedBookNothing_2 ib,
      "nothing_3"           .= importedBookNothing_3 ib,
      "nothing_4"           .= importedBookNothing_4 ib,
      "nothing_5"           .= importedBookNothing_5 ib,
      "nothing_6"           .= importedBookNothing_6 ib,
      "nothing_7"           .= importedBookNothing_7 ib,
      "nothing_8"           .= importedBookNothing_8 ib,
      "nothing_9"           .= importedBookNothing_9 ib
      ]
      where
         the_language Nothing  = Nothing
         the_language (Just x) = Just $ show x

instance FromJSON ImportedBook where
   parseJSON (Object v) = do 
      note                <- v .: "note"
      callnumber          <- v .: "callnumber"
      title               <- v .: "title"
      original_language   <- v .: "original_language"
      author_title_1      <- v .: "author_title_1"
      author_1            <- v .: "author_1"
      other_names_1       <- v .: "other_names_1"
      text_by             <- v .: "text_by"
      illustrator         <- v .: "illustrator"
      author_2            <- v .: "author_2"
      author_3            <- v .: "author_3"
      author_4            <- v .: "author_4"
      translator_1        <- v .: "translator_1"
      translator_2        <- v .: "translator_2"
      editor_title_1      <- v .: "editor_title_1"
      editor_1            <- v .: "editor_1"
      editor_2            <- v .: "editor_2"
      preparer            <- v .: "preparer"
      compilor_title      <- v .: "compilor_title"
      compilor            <- v .: "compilor"
      pagecount           <- v .: "pagecount"
      publisher           <- v .: "publisher"
      year                <- v .: "year"
      location            <- v .: "location"
      random_symbols      <- v .: "random_symbols"
      nothing             <- v .: "nothing"
      probably_irrelevant <- v .: "probably_irrelevant"
      nothing_1           <- v .: "nothing_1"
      nothing_2           <- v .: "nothing_2"
      nothing_3           <- v .: "nothing_3"
      nothing_4           <- v .: "nothing_4"
      nothing_5           <- v .: "nothing_5"
      nothing_6           <- v .: "nothing_6"
      nothing_7           <- v .: "nothing_7"
      nothing_8           <- v .: "nothing_8"
      nothing_9           <- v .: "nothing_9"
      return ImportedBook {
         importedBookNote                = note,
         importedBookCallnumber          = callnumber,
         importedBookTitle               = title,
         importedBookOriginal_language   = mightRead original_language,
         importedBookAuthor_title_1      = author_title_1,
         importedBookAuthor_1            = author_1,
         importedBookOther_names_1       = other_names_1,
         importedBookText_by             = text_by,
         importedBookIllustrator         = illustrator,
         importedBookAuthor_2            = author_2,
         importedBookAuthor_3            = author_3,
         importedBookAuthor_4            = author_4,
         importedBookTranslator_1        = translator_1,
         importedBookTranslator_2        = translator_2,
         importedBookEditor_title_1      = editor_title_1,
         importedBookEditor_1            = editor_1,
         importedBookEditor_2            = editor_2,
         importedBookPreparer            = preparer,
         importedBookCompilor_title      = compilor_title,
         importedBookCompilor            = compilor,
         importedBookPagecount           = mightRead pagecount,
         importedBookPublisher           = publisher,
         importedBookYear                = mightRead year,
         importedBookLocation            = location,
         importedBookRandom_symbols      = random_symbols,
         importedBookNothing             = nothing,
         importedBookProbably_irrelevant = probably_irrelevant,
         importedBookNothing_1           = nothing_1,
         importedBookNothing_2           = nothing_2,
         importedBookNothing_3           = nothing_3,
         importedBookNothing_4           = nothing_4,
         importedBookNothing_5           = nothing_5,
         importedBookNothing_6           = nothing_6,
         importedBookNothing_7           = nothing_7,
         importedBookNothing_8           = nothing_8,
         importedBookNothing_9           = nothing_9
      }
   parseJSON _ = mzero

-- vim:set expandtab:
