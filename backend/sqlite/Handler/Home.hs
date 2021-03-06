module Handler.Home where

import Import
import Data.Aeson
import Yesod.Core.Types
import Data.Conduit.List
import Yesod.Form.Bootstrap3 (BootstrapFormLayout (..), renderBootstrap3,
                              withSmallInput)
import Control.Applicative
import qualified Data.ByteString as B
import qualified Data.ByteString.Char8 as B8
import qualified Data.Conduit.Attoparsec as CA
import Data.Aeson
import Data.Conduit
import Data.Conduit.Binary
import Control.Monad.IO.Class

catalogue :: [ImportedBook]
catalogue = [ImportedBook {
   importedBookNote                = Just "Original 'Le Tyran, le Luthier et le Temps' 2003",
   importedBookCallnumber          = Nothing,
   importedBookOriginal_language   = Just French,
   importedBookTitle               = Just "La Tirano, la Liutfaristo kaj la Tempo",
   importedBookAuthor_title_1      = Nothing,
   importedBookAuthor_1            = Just "Christian Grenier -- into textby",
   importedBookOther_names_1       = Nothing,
   importedBookText_by             = Nothing,
   importedBookIllustrator         = Just "François Schmidt",
   importedBookAuthor_2            = Nothing,
   importedBookAuthor_3            = Nothing,
   importedBookAuthor_4            = Nothing,
   importedBookTranslator_1        = Just "Ange Mateo",
   importedBookTranslator_2        = Nothing,
   importedBookEditor_title_1      = Nothing,
   importedBookEditor_1            = Nothing,
   importedBookEditor_2            = Nothing,
   importedBookPreparer            = Nothing,
   importedBookCompilor_title      = Nothing,
   importedBookCompilor            = Nothing,
   importedBookPagecount           = Nothing,
   importedBookPublisher           = Just "Groupe Espérantiste Périgourdin/Perigoda Esperantista Grupo",
   importedBookYear                = Just 2013,
   importedBookLocation            = Just "Bassilac, France",
   importedBookRandom_symbols      = Nothing,
   importedBookNothing             = Nothing,
   importedBookProbably_irrelevant = Nothing,
   importedBookNothing_1           = Nothing,
   importedBookNothing_2           = Nothing,
   importedBookNothing_3           = Nothing,
   importedBookNothing_4           = Nothing,
   importedBookNothing_5           = Nothing,
   importedBookNothing_6           = Nothing,
   importedBookNothing_7           = Nothing,
   importedBookNothing_8           = Nothing,
   importedBookNothing_9           = Nothing
}]

getCatalogueR :: Handler Value
getCatalogueR = returnJson catalogue

maybify (Error s) = Left (Right (show s))
maybify (Success s) = Right s

-- parseMessage :: (MonadIO m, MonadResource m) => Conduit B.ByteString m B.ByteString
parseMessage = CA.conduitParserEither json =$= awaitForever go
   where
      go (Left s) = yield $ Left (Left s)
      go (Right (_, msg)) = yield $ maybify $ ((fromJSON msg)::Result ImportedBook)


squiggle = awaitForever go
   where
      go x = yield $ B8.pack $ show x ++ "\n"

-- postJsonImportR :: Handler Value
postJsonImportR = do
   squidj <- jsonImportForm
   sendTheFile squidj

sendTheFile (Just fi) = runResourceT $ do
   fileSource fi $$ parseMessage =$= squiggle =$ Data.Conduit.Binary.sinkFile "/tmp/aeou"
   return "foo"
sendTheFile Nothing = return ("bar"::Text)

jsonImportForm = do
   result <- runInputPostResult $ ireq fileField "json_file"
   let msubmission = case result of
                       FormSuccess res -> Just res
                       _               -> Nothing
   return msubmission


-- This is a handler function for the GET request method on the HomeR
-- resource pattern. All of your resource patterns are defined in
-- config/routes
--
-- The majority of the code you will write in Yesod lives in these handler
-- functions. You can spread them across multiple files if you are so
-- inclined, or create a single monolithic file.
getHomeR :: Handler Html
getHomeR = do
    (formWidget, formEnctype) <- generateFormPost sampleForm
    let submission = Nothing :: Maybe (FileInfo, Text)
        handlerName = "getHomeR" :: Text
    defaultLayout $ do
        aDomId <- newIdent
        setTitle "Welcome To Yesod!"
        $(widgetFile "homepage")

postHomeR :: Handler Html
postHomeR = do
    ((result, formWidget), formEnctype) <- runFormPost sampleForm
    let handlerName = "postHomeR" :: Text
        submission = case result of
            FormSuccess res -> Just res
            _ -> Nothing

    defaultLayout $ do
        aDomId <- newIdent
        setTitle "Welcome To Yesod!"
        $(widgetFile "homepage")

sampleForm :: Form (FileInfo, Text)
sampleForm = renderBootstrap3 BootstrapBasicForm $ (,)
    <$> fileAFormReq "Choose a file"
    <*> areq textField (withSmallInput "What's on the file?") Nothing
-- vim:set expandtab:
