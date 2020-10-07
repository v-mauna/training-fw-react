import React, { useEffect, useState } from 'react';
import {
  IonHeader,
  IonContent,
  IonFooter,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTextarea,
} from '@ionic/react';
import { close } from 'ionicons/icons';
import { Controller, useForm } from 'react-hook-form';
import { TastingNote, Tea } from '../../shared/models';
import { Rating } from '../../shared/components';
import { useTea } from '../../tea/useTea';
import { useTastingNotes } from '../useTastingNotes';

interface TastingNoteEditorProps {
  onDismiss: (opts: { refresh: boolean }) => void;
  note?: TastingNote;
}

const TastingNoteEditor: React.FC<TastingNoteEditorProps> = ({
  onDismiss,
  note = undefined,
}) => {
  const { handleSubmit, control, formState } = useForm<TastingNote>({
    mode: 'onChange',
  });
  const [teas, setTeas] = useState<Array<Tea>>([]);
  const { getTeas } = useTea();
  const { saveNote } = useTastingNotes();

  useEffect(() => {
    const init = async () => {
      const teas = await getTeas();
      setTeas(teas);
    };
    init();
  }, [getTeas]);

  const save = async (data: TastingNote) => {
    if (note?.id) data.id = note.id;
    await saveNote(data);
    onDismiss({ refresh: true });
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{!note && 'Add New'} Tasting Note</IonTitle>
          <IonButtons slot="primary">
            <IonButton
              id="cancel-button"
              onClick={() => onDismiss({ refresh: false })}
            >
              <IonIcon slot="icon-only" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <form>
          <IonItem>
            <IonLabel position="floating">Brand</IonLabel>
            <Controller
              render={({ onChange, value }) => (
                <IonInput
                  id="brand-input"
                  onIonChange={(e: any) => onChange(e.detail.value!)}
                  value={value}
                />
              )}
              control={control}
              name="brand"
              rules={{ required: true }}
              defaultValue={note?.brand || ''}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Name</IonLabel>
            <Controller
              render={({ onChange, value }) => (
                <IonInput
                  id="name-input"
                  onIonChange={(e: any) => onChange(e.detail.value!)}
                  value={value}
                />
              )}
              control={control}
              name="name"
              rules={{ required: true }}
              defaultValue={note?.name || ''}
            />
          </IonItem>
          <IonItem>
            <IonLabel>Category</IonLabel>
            <Controller
              render={({ onChange, value }) => (
                <>
                  {teas.length && (
                    <IonSelect
                      onIonChange={(e: any) => onChange(e.detail.value!)}
                      value={value}
                    >
                      {teas.map((tea: Tea) => (
                        <IonSelectOption key={tea.id} value={tea.id}>
                          {tea.name}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  )}
                </>
              )}
              control={control}
              name="teaCategoryId"
              rules={{ required: true }}
              defaultValue={note?.teaCategoryId || 1}
            />
          </IonItem>
          <IonItem>
            <IonLabel>Rating</IonLabel>
            <Controller
              render={({ onChange, value }) => (
                <Rating onRatingChange={onChange} initialRating={value} />
              )}
              control={control}
              name="rating"
              rules={{ required: true }}
              defaultValue={note?.rating || 0}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Notes</IonLabel>
            <Controller
              render={({ onChange, value }) => (
                <IonTextarea
                  id="notes-input"
                  onIonChange={(e: any) => onChange(e.detail.value!)}
                  rows={5}
                  value={value}
                />
              )}
              control={control}
              name="notes"
              rules={{ required: true }}
              defaultValue={note?.notes || ''}
            />
          </IonItem>
        </form>
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <IonButton
            type="submit"
            disabled={!formState.isValid}
            expand="full"
            onClick={handleSubmit(data => save(data))}
          >
            {note ? 'Update' : 'Add'}
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </>
  );
};
export default TastingNoteEditor;
