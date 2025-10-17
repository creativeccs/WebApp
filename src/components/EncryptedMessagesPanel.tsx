import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useI18n } from '@/contexts/I18nContext';
import { useEncryptedMessages } from '@/hooks/useEncryptedMessages';
import { useDeleteNostrEvent } from '@/hooks/useDeleteNostrEvent';
import { useHiddenMessages } from '@/hooks/useHiddenMessages';
import { Mail, AlertCircle, Lock, Trash2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export function EncryptedMessagesPanel() {
  const { t } = useI18n();
  const { data: allMessages, isLoading, error } = useEncryptedMessages();
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteNostrEvent();
  const { hideMessage, isHidden, hiddenIds } = useHiddenMessages();
  const [showHidden, setShowHidden] = useState(false);

  // Filter out hidden messages unless showHidden is true
  const messages = showHidden 
    ? allMessages 
    : allMessages?.filter((msg) => !isHidden(msg.id));

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t.encryptedMessages}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t.encryptedMessages}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t.encryptedMessages}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">{t.noEncryptedMessages}</h3>
          <p className="text-muted-foreground text-sm">{t.noMessagesReceived}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t.encryptedMessages}
            <Badge variant="secondary">
              {messages?.length || 0}
            </Badge>
          </CardTitle>
          {hiddenIds.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHidden(!showHidden)}
              className="gap-2"
            >
              {showHidden ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  {t.hide} {hiddenIds.length}
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  {t.showHidden} ({hiddenIds.length})
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.map((msg) => (
          <Card key={msg.id} className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {msg.decryptedContent ? (
                    <>
                      <div className="font-semibold text-lg mb-1">
                        {msg.decryptedContent.subject || t.noSubject}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>
                          <span className="font-medium">{t.from}:</span>{' '}
                          {msg.decryptedContent.name}
                          {msg.decryptedContent.email && (
                            <span className="ms-2" dir="ltr">
                              ({msg.decryptedContent.email})
                            </span>
                          )}
                        </div>
                        {msg.decryptedContent.phone && (
                          <div>
                            <span className="font-medium">{t.phone}:</span>{' '}
                            <span dir="ltr">{msg.decryptedContent.phone}</span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium">{t.sentOn}:</span>{' '}
                          {new Date(msg.decryptedContent.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 inline me-1" />
                      {t.decryptionFailed}: {msg.error || 'Unknown error'}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={msg.decryptedContent ? 'default' : 'destructive'}>
                    {msg.decryptedContent ? t.decrypted : t.failed}
                  </Badge>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isDeleting}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {msg.decryptedContent ? t.deleteMessageConfirm : t.hideMessageConfirm}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {msg.decryptedContent 
                            ? t.deleteMessageDescription
                            : t.hideMessageDescription
                          }
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            if (msg.decryptedContent) {
                              // Try to delete from relay (only works if we own the event)
                              deleteEvent(msg.id);
                            } else {
                              // Just hide it locally
                              hideMessage(msg.id);
                            }
                          }}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {msg.decryptedContent ? t.delete : t.hide}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            {msg.decryptedContent && (
              <CardContent className="pt-0">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="text-sm font-medium mb-2">{t.message}:</div>
                  <p className="text-sm whitespace-pre-wrap">{msg.decryptedContent.message}</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
