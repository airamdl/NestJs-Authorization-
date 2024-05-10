import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../user/entities/user.entity";
import { Ability, AbilityBuilder, AbilityClass, InferSubjects, ExtractSubjectType } from "@casl/ability";
import { Action } from "../../user/enum/actionArticle.enum";
import { Article } from "../../user/entities/article.entity";


type Subjects = InferSubjects<typeof Article | typeof UserEntity> | 'all';
export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {

    createForUser(user: UserEntity) {
        const { can, cannot, build } = new AbilityBuilder<
            Ability<[Action, Subjects]>
        >(Ability as AbilityClass<AppAbility>);

        if (user.isAdmin) {
            can(Action.Manage, 'all')
        } else {
            can(Action.Read, 'all')
            cannot(Action.Create, UserEntity).because(
                '(Error from ability) Only admins'
            )
        }
        can(Action.Update, Article, { authorId: user.id })
        cannot(Action.Read, 'all')
        return build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        })
    }

}