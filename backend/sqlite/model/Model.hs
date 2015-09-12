module Model where

import ClassyPrelude.Yesod
import Database.Persist.Quasi
import Language

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

